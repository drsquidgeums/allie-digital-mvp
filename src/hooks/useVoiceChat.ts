import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { notifyAICreditsUsed } from '@/utils/aiCreditsEvent';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UseVoiceChatOptions {
  onSpeakingChange?: (isSpeaking: boolean) => void;
  onListeningChange?: (isListening: boolean) => void;
}

const SPEECH_THRESHOLD = 0.03; // RMS threshold for "speech"
const SILENCE_MS_TO_COMMIT = 1100;
const MIN_RECORD_MS = 700;

function blobToBase64(blob: Blob): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read audio'));
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== 'string') return reject(new Error('Invalid audio encoding'));
      const comma = result.indexOf(',');
      if (comma === -1) return reject(new Error('Invalid data url'));
      const base64 = result.slice(comma + 1);
      resolve({ base64, mimeType: blob.type || 'audio/webm' });
    };
    reader.readAsDataURL(blob);
  });
}

export const useVoiceChat = (options: UseVoiceChatOptions = {}) => {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isProcessingRef = useRef(false);
  const isActiveRef = useRef(false);
  const isSpeakingRef = useRef(false);

  // Mic/VAD refs
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const vadRafRef = useRef<number | null>(null);

  // Recording refs
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingRef = useRef(false);
  const recordStartedAtRef = useRef<number>(0);
  const lastVoiceAtRef = useRef<number>(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Notify parent of state changes
  useEffect(() => {
    options.onSpeakingChange?.(isSpeaking);
  }, [isSpeaking, options.onSpeakingChange]);

  useEffect(() => {
    options.onListeningChange?.(isListening);
  }, [isListening, options.onListeningChange]);

  const speakWithBrowserTTS = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      speechSynthesis.speak(utterance);
    });
  }, []);

  const speakWithElevenLabs = useCallback(async (text: string): Promise<void> => {
    setIsSpeaking(true);
    isSpeakingRef.current = true;

    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts-public', {
        body: { text, voiceId: 'EXAVITQu4vr4xnSDxMaL' },
      });

      if (error) throw new Error(error.message);
      if (!data?.audioContent) throw new Error('No audio received');

      const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      notifyAICreditsUsed();

      await new Promise<void>((resolve, reject) => {
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error('Audio playback failed'));
        audio.play().catch(reject);
      });
    } catch (err) {
      console.error('TTS error (fallback to browser):', err);
      toast({
        title: 'Voice Playback Issue',
        description: 'If you can’t hear Allie, check your device volume and site sound permissions.',
        variant: 'destructive',
      });
      await speakWithBrowserTTS(text);
    } finally {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      audioRef.current = null;
    }
  }, [speakWithBrowserTTS, toast]);

  const transcribeWithElevenLabs = useCallback(async (blob: Blob) => {
    const { base64, mimeType } = await blobToBase64(blob);
    const { data, error } = await supabase.functions.invoke('elevenlabs-transcribe', {
      body: { audioBase64: base64, mimeType },
    });
    if (error) throw new Error(error.message);
    const text = typeof data?.text === 'string' ? data.text : '';
    return text.trim();
  }, []);

  const runVadLoop = useCallback(() => {
    if (!isActiveRef.current) return;
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const buffer = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(buffer);

    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      const v = (buffer[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / buffer.length);
    const now = Date.now();

    const canRecord = !isProcessingRef.current && !isSpeakingRef.current;

    if (canRecord) {
      if (rms > SPEECH_THRESHOLD) {
        lastVoiceAtRef.current = now;
        if (!recordingRef.current) {
          // Start recording when user begins speaking
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
  }, []);

  const startRecording = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) return;

    if (typeof MediaRecorder === 'undefined') {
      toast({
        title: 'Not Supported',
        description: 'Audio recording is not supported in this browser.',
        variant: 'destructive',
      });
      return;
    }

    try {
      chunksRef.current = [];

      let recorder: MediaRecorder;
      const preferred = 'audio/webm;codecs=opus';
      if (MediaRecorder.isTypeSupported?.(preferred)) {
        recorder = new MediaRecorder(stream, { mimeType: preferred });
      } else {
        recorder = new MediaRecorder(stream);
      }

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstart = () => {
        recordingRef.current = true;
        recordStartedAtRef.current = Date.now();
        lastVoiceAtRef.current = Date.now();
        setIsListening(true);
      };

      recorder.onstop = async () => {
        recordingRef.current = false;

        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        chunksRef.current = [];

        if (!isActiveRef.current) return;
        if (blob.size < 800) return; // ignore tiny clips

        setIsListening(false);
        setIsProcessing(true);
        isProcessingRef.current = true;

        try {
          const text = await transcribeWithElevenLabs(blob);
          if (!text) {
            // go back to listening
            return;
          }

          setTranscript(text);

          const { data, error } = await supabase.functions.invoke('voice-chat', {
            body: {
              message: text,
              conversationHistory,
            },
          });

          if (error) throw new Error(error.message);

          const aiResponse = data?.response;
          const nextHistory = data?.conversationHistory;

          if (Array.isArray(nextHistory)) {
            setConversationHistory(nextHistory);
          } else {
            // fallback local append
            setConversationHistory((prev) => [...prev, { role: 'user', content: text }, { role: 'assistant', content: String(aiResponse || '') }]);
          }

          if (typeof aiResponse === 'string' && aiResponse.trim()) {
            await speakWithElevenLabs(aiResponse.trim());
          }
        } catch (err: any) {
          console.error('Voice flow error:', err);
          toast({
            title: 'Voice Assistant Error',
            description: err?.message || 'Something went wrong. Please try again.',
            variant: 'destructive',
          });
        } finally {
          isProcessingRef.current = false;
          setIsProcessing(false);
          // resume passive listening
          setIsListening(true);
        }
      };

      recorderRef.current = recorder;
      recorder.start();
    } catch (err) {
      console.error('Failed to start recorder:', err);
    }
  }, [conversationHistory, speakWithElevenLabs, toast, transcribeWithElevenLabs]);

  const stopRecording = useCallback(() => {
    const rec = recorderRef.current;
    if (!rec) return;
    try {
      if (rec.state !== 'inactive') rec.stop();
    } catch (err) {
      console.log('Recorder stop failed:', err);
    }
  }, []);

  const startSession = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      // Set up analyser for VAD
      const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextCtor();

      // Best-effort: ensure the audio context is running (some browsers start it suspended)
      if (ctx.state === 'suspended') {
        try {
          await ctx.resume();
        } catch {
          // ignore
        }
      }

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;

      isActiveRef.current = true;
      setIsActive(true);
      setIsListening(true);
      setConversationHistory([]);

      toast({
        title: 'Voice Assistant Ready',
        description: 'Start speaking to chat with Allie',
      });

      // Start VAD loop
      if (vadRafRef.current) cancelAnimationFrame(vadRafRef.current);
      vadRafRef.current = requestAnimationFrame(runVadLoop);
    } catch (err) {
      console.error('Failed to start voice session:', err);
      toast({
        title: 'Microphone Error',
        description: 'Please allow microphone access to use the voice assistant.',
        variant: 'destructive',
      });
    }
  }, [runVadLoop, toast]);

  const stopSession = useCallback(() => {
    isActiveRef.current = false;

    if (vadRafRef.current) {
      cancelAnimationFrame(vadRafRef.current);
      vadRafRef.current = null;
    }

    if (recorderRef.current) {
      try {
        if (recorderRef.current.state !== 'inactive') recorderRef.current.stop();
      } catch {
        // ignore
      }
      recorderRef.current = null;
    }

    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop();
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => undefined);
      audioContextRef.current = null;
    }

    analyserRef.current = null;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    speechSynthesis.cancel();

    isProcessingRef.current = false;
    recordingRef.current = false;
    chunksRef.current = [];

    setIsActive(false);
    setIsListening(false);
    setIsSpeaking(false);
    setIsProcessing(false);
    setTranscript('');
  }, []);

  return {
    isActive,
    isListening,
    isSpeaking,
    isProcessing,
    transcript,
    conversationHistory,
    startSession,
    stopSession,
  };
};
