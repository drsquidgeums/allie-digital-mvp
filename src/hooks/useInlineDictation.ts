import { useCallback, useEffect, useRef, useState } from 'react';
import { Editor } from '@tiptap/react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { notifyAICreditsUsed } from '@/utils/aiCreditsEvent';
import { handleAIUsageLimitError } from '@/utils/aiUsageLimitHandler';

const SPEECH_THRESHOLD = 0.03;
const SILENCE_MS_TO_COMMIT = 900;
const MIN_RECORD_MS = 500;
const MIN_AUDIO_BLOB_SIZE = 800;
const HANDLED_ERROR = '__DICTATION_HANDLED_ERROR__';
const RECORDER_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
  'audio/ogg',
];

type DictationMode = 'browser' | 'elevenlabs';

interface UseInlineDictationOptions {
  editor: Editor | null;
  insertText: (text: string) => void;
}

const getSupportedRecorderMimeType = () => {
  if (
    typeof MediaRecorder === 'undefined' ||
    typeof MediaRecorder.isTypeSupported !== 'function'
  ) {
    return '';
  }

  return (
    RECORDER_MIME_TYPES.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) ?? ''
  );
};

const blobToBase64 = (blob: Blob): Promise<{ base64: string; mimeType: string }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read recorded audio'));
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Invalid audio encoding'));
        return;
      }

      const commaIndex = reader.result.indexOf(',');
      if (commaIndex === -1) {
        reject(new Error('Invalid audio data'));
        return;
      }

      resolve({
        base64: reader.result.slice(commaIndex + 1),
        mimeType: blob.type || 'audio/webm',
      });
    };

    reader.readAsDataURL(blob);
  });

export const useInlineDictation = ({
  editor,
  insertText,
}: UseInlineDictationOptions) => {
  const [isListening, setIsListening] = useState(false);

  const modeRef = useRef<DictationMode | null>(null);
  const shouldContinueRef = useRef(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const vadRafRef = useRef<number | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recorderMimeTypeRef = useRef('');
  const chunksRef = useRef<Blob[]>([]);
  const recordingRef = useRef(false);
  const isProcessingRef = useRef(false);
  const recordStartedAtRef = useRef(0);
  const lastVoiceAtRef = useRef(0);

  const browserRecognitionSupported =
    typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const recorderSupported =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    typeof MediaRecorder !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    (typeof window.AudioContext !== 'undefined' ||
      typeof (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext !== 'undefined');

  const isSupported = browserRecognitionSupported || recorderSupported;

  const teardownAudioResources = useCallback(() => {
    if (vadRafRef.current) {
      cancelAnimationFrame(vadRafRef.current);
      vadRafRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => undefined);
      audioContextRef.current = null;
    }

    analyserRef.current = null;
  }, []);

  const clearBrowserRecognition = useCallback(() => {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;

    if (!recognition) return;

    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;

    try {
      recognition.stop();
    } catch {
      // Ignore stop errors when the recognition instance is already inactive.
    }
  }, []);

  const abortRecorder = useCallback(() => {
    const recorder = recorderRef.current;
    recorderRef.current = null;

    if (!recorder) return;

    recorder.ondataavailable = null;
    recorder.onerror = null;
    recorder.onstop = null;

    try {
      if (recorder.state !== 'inactive') {
        recorder.stop();
      }
    } catch {
      // Ignore stop errors during teardown.
    }
  }, []);

  const transcribeBlob = useCallback(async (blob: Blob) => {
    const { base64, mimeType } = await blobToBase64(blob);

    const { data, error } = await supabase.functions.invoke('elevenlabs-transcribe', {
      body: { audioBase64: base64, mimeType },
    });

    if (error) {
      if (handleAIUsageLimitError(error)) {
        throw new Error(HANDLED_ERROR);
      }

      throw new Error(error.message || 'Failed to transcribe speech');
    }

    notifyAICreditsUsed();

    return typeof data?.text === 'string' ? data.text.trim() : '';
  }, []);

  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current;
    recorderRef.current = null;

    if (!recorder) return;

    if (recorder.state === 'inactive') {
      recordingRef.current = false;
      isProcessingRef.current = false;
      return;
    }

    isProcessingRef.current = true;

    try {
      recorder.stop();
    } catch {
      recordingRef.current = false;
      isProcessingRef.current = false;

      if (!shouldContinueRef.current) {
        teardownAudioResources();
        setIsListening(false);
      }
    }
  }, [teardownAudioResources]);

  const startRecording = useCallback(() => {
    if (
      !streamRef.current ||
      recordingRef.current ||
      isProcessingRef.current ||
      !shouldContinueRef.current
    ) {
      return;
    }

    recordingRef.current = true;

    try {
      chunksRef.current = [];

      const preferredMimeType = getSupportedRecorderMimeType();
      recorderMimeTypeRef.current = preferredMimeType;

      const recorder = preferredMimeType
        ? new MediaRecorder(streamRef.current, { mimeType: preferredMimeType })
        : new MediaRecorder(streamRef.current);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        recordingRef.current = false;
        isProcessingRef.current = false;
        shouldContinueRef.current = false;
        teardownAudioResources();
        setIsListening(false);
        toast.error('Dictation recording failed');
      };

      recorder.onstart = () => {
        recordStartedAtRef.current = Date.now();
        lastVoiceAtRef.current = Date.now();
      };

      recorder.onstop = async () => {
        recordingRef.current = false;

        const blobType =
          recorder.mimeType ||
          recorderMimeTypeRef.current ||
          chunksRef.current[0]?.type ||
          'audio/webm';
        const blob = new Blob(chunksRef.current, { type: blobType });
        chunksRef.current = [];

        if (blob.size < MIN_AUDIO_BLOB_SIZE) {
          isProcessingRef.current = false;

          if (!shouldContinueRef.current) {
            teardownAudioResources();
            setIsListening(false);
          }

          return;
        }

        try {
          const text = await transcribeBlob(blob);
          if (text) {
            insertText(text);
          }
        } catch (error) {
          const isHandledError =
            error instanceof Error && error.message === HANDLED_ERROR;

          if (!isHandledError && shouldContinueRef.current) {
            toast.error(
              error instanceof Error ? error.message : 'Speech-to-text failed'
            );
          }

          shouldContinueRef.current = false;
          modeRef.current = null;
          teardownAudioResources();
          setIsListening(false);
        } finally {
          isProcessingRef.current = false;

          if (!shouldContinueRef.current) {
            teardownAudioResources();
            setIsListening(false);
          }
        }
      };

      recorderRef.current = recorder;
      recorder.start();
    } catch (error) {
      recordingRef.current = false;
      isProcessingRef.current = false;
      console.error('[STT] Failed to start recorder:', error);
      shouldContinueRef.current = false;
      teardownAudioResources();
      setIsListening(false);
      toast.error('Failed to start dictation recording');
    }
  }, [insertText, teardownAudioResources, transcribeBlob]);

  const runVadLoop = useCallback(() => {
    if (!shouldContinueRef.current || modeRef.current !== 'elevenlabs' || !analyserRef.current) {
      return;
    }

    const analyser = analyserRef.current;
    const buffer = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(buffer);

    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      const value = (buffer[i] - 128) / 128;
      sum += value * value;
    }

    const rms = Math.sqrt(sum / buffer.length);
    const now = Date.now();

    if (!isProcessingRef.current) {
      if (rms > SPEECH_THRESHOLD) {
        lastVoiceAtRef.current = now;
        if (!recordingRef.current) {
          startRecording();
        }
      }

      if (recordingRef.current) {
        const silentFor = now - lastVoiceAtRef.current;
        const recordedFor = now - recordStartedAtRef.current;

        if (silentFor > SILENCE_MS_TO_COMMIT && recordedFor > MIN_RECORD_MS) {
          stopRecording();
        }
      }
    }

    vadRafRef.current = requestAnimationFrame(runVadLoop);
  }, [startRecording, stopRecording]);

  const createBrowserRecognition = useCallback(() => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition })
        .webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      throw new Error('Speech recognition is not supported in this browser');
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = navigator.language || 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (!event.results[i].isFinal) continue;

        const transcript = event.results[i][0]?.transcript?.trim();
        if (transcript) {
          insertText(transcript);
        }
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') {
        return;
      }

      shouldContinueRef.current = false;
      modeRef.current = null;
      setIsListening(false);

      if (event.error === 'not-allowed') {
        toast.error('Microphone access denied – please allow microphone permission');
        return;
      }

      toast.error(`Speech recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      if (shouldContinueRef.current && modeRef.current === 'browser') {
        try {
          const restartedRecognition = createBrowserRecognition();
          restartedRecognition.start();
          recognitionRef.current = restartedRecognition;
          return;
        } catch (error) {
          console.error('[STT] Failed to restart browser recognition:', error);
        }
      }

      modeRef.current = null;
      setIsListening(false);
    };

    return recognition;
  }, [insertText]);

  const startBrowserRecognition = useCallback(() => {
    const recognition = createBrowserRecognition();
    recognition.start();
    recognitionRef.current = recognition;
    modeRef.current = 'browser';
    setIsListening(true);
  }, [createBrowserRecognition]);

  const startElevenLabsDictation = useCallback(async () => {
    const AudioContextCtor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextCtor) {
      throw new Error('Audio capture is not supported in this browser');
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    const context = new AudioContextCtor();

    if (context.state === 'suspended') {
      try {
        await context.resume();
      } catch {
        // Ignore resume issues and continue best-effort.
      }
    }

    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);

    streamRef.current = stream;
    audioContextRef.current = context;
    analyserRef.current = analyser;
    modeRef.current = 'elevenlabs';
    setIsListening(true);

    if (vadRafRef.current) {
      cancelAnimationFrame(vadRafRef.current);
    }

    vadRafRef.current = requestAnimationFrame(runVadLoop);
  }, [runVadLoop]);

  const determinePreferredMode = useCallback(async (): Promise<DictationMode | null> => {
    if (recorderSupported) {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!error && session?.access_token) {
        return 'elevenlabs';
      }
    }

    if (browserRecognitionSupported) {
      return 'browser';
    }

    return null;
  }, [browserRecognitionSupported, recorderSupported]);

  const startListening = useCallback(async (): Promise<DictationMode | null> => {
    if (!editor) {
      toast.error('No editor available – open a document first');
      return null;
    }

    const preferredMode = await determinePreferredMode();
    if (!preferredMode) {
      toast.error(
        'Dictation needs a signed-in account on this browser, or a browser with built-in speech recognition support.'
      );
      return null;
    }

    shouldContinueRef.current = true;
    editor.chain().focus().run();

    try {
      if (preferredMode === 'elevenlabs') {
        try {
          await startElevenLabsDictation();
          return 'elevenlabs';
        } catch (error) {
          console.error('[STT] ElevenLabs dictation failed to start:', error);
          abortRecorder();
          teardownAudioResources();

          if (browserRecognitionSupported) {
            startBrowserRecognition();
            return 'browser';
          }

          throw error;
        }
      }

      startBrowserRecognition();
      return 'browser';
    } catch (error) {
      shouldContinueRef.current = false;
      modeRef.current = null;
      clearBrowserRecognition();
      abortRecorder();
      teardownAudioResources();
      setIsListening(false);

      toast.error(
        error instanceof Error ? error.message : 'Failed to start speech recognition'
      );
      return null;
    }
  }, [
    abortRecorder,
    browserRecognitionSupported,
    clearBrowserRecognition,
    determinePreferredMode,
    editor,
    startBrowserRecognition,
    startElevenLabsDictation,
    teardownAudioResources,
  ]);

  const stopListening = useCallback(() => {
    shouldContinueRef.current = false;
    modeRef.current = null;

    clearBrowserRecognition();

    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      stopRecording();
      return;
    }

    abortRecorder();
    teardownAudioResources();
    setIsListening(false);
  }, [abortRecorder, clearBrowserRecognition, stopRecording, teardownAudioResources]);

  useEffect(() => {
    return () => {
      shouldContinueRef.current = false;
      modeRef.current = null;
      isProcessingRef.current = false;
      recorderMimeTypeRef.current = '';
      clearBrowserRecognition();
      abortRecorder();
      teardownAudioResources();
    };
  }, [abortRecorder, clearBrowserRecognition, teardownAudioResources]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
  };
};