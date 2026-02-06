import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UseVoiceChatOptions {
  onSpeakingChange?: (isSpeaking: boolean) => void;
  onListeningChange?: (isListening: boolean) => void;
}

export const useVoiceChat = (options: UseVoiceChatOptions = {}) => {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isProcessingRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  // Notify parent of state changes
  useEffect(() => {
    options.onSpeakingChange?.(isSpeaking);
  }, [isSpeaking, options.onSpeakingChange]);

  useEffect(() => {
    options.onListeningChange?.(isListening);
  }, [isListening, options.onListeningChange]);

  const speakWithElevenLabs = useCallback(async (text: string): Promise<void> => {
    setIsSpeaking(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: { text, voiceId: 'EXAVITQu4vr4xnSDxMaL' } // Sarah voice
      });

      if (error) throw new Error(error.message);
      if (!data?.audioContent) throw new Error('No audio received');

      // Use data URI for base64 audio - browser handles decoding
      const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      await new Promise<void>((resolve, reject) => {
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error('Audio playback failed'));
        audio.play().catch(reject);
      });
    } catch (error) {
      console.error('TTS error:', error);
      // Fallback to browser TTS
      await speakWithBrowserTTS(text);
    } finally {
      setIsSpeaking(false);
      audioRef.current = null;
    }
  }, []);

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

  const processUserInput = useCallback(async (userMessage: string) => {
    if (isProcessingRef.current || !userMessage.trim()) return;
    
    isProcessingRef.current = true;
    setIsProcessing(true);
    setTranscript('');

    try {
      const { data, error } = await supabase.functions.invoke('voice-chat', {
        body: { 
          message: userMessage,
          conversationHistory 
        }
      });

      if (error) throw new Error(error.message);

      const aiResponse = data.response;
      setConversationHistory(data.conversationHistory || []);

      // Speak the response
      await speakWithElevenLabs(aiResponse);

      // Resume listening after speaking (if still active)
      if (isActive && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Recognition might already be started
        }
      }
    } catch (error) {
      console.error('Voice chat error:', error);
      toast({
        title: 'Error',
        description: 'Failed to process your message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  }, [conversationHistory, isActive, speakWithElevenLabs, toast]);

  const startSession = useCallback(async () => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: 'Not Supported',
        description: 'Speech recognition is not supported in your browser. Please try Chrome or Edge.',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      // Set listening state when recognition starts
      setIsListening(true);

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(interimTranscript || finalTranscript);

        if (finalTranscript) {
          setIsListening(false);
          processUserInput(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'aborted' && event.error !== 'no-speech') {
          toast({
            title: 'Recognition Error',
            description: 'Failed to recognize speech. Please try again.',
            variant: 'destructive'
          });
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Auto-restart if session is still active and not processing
        if (isActive && !isProcessingRef.current && !isSpeaking) {
          try {
            recognition.start();
          } catch (e) {
            // Ignore errors when restarting
          }
        }
      };

      recognitionRef.current = recognition;
      setIsActive(true);
      setConversationHistory([]);
      recognition.start();

      toast({
        title: 'Voice Assistant Ready',
        description: 'Start speaking to chat with Allie'
      });
    } catch (error) {
      console.error('Failed to start voice session:', error);
      toast({
        title: 'Microphone Error',
        description: 'Please allow microphone access to use the voice assistant.',
        variant: 'destructive'
      });
    }
  }, [isActive, isSpeaking, processUserInput, toast]);

  const stopSession = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    speechSynthesis.cancel();

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
    stopSession
  };
};
