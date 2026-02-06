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
  const isActiveRef = useRef(false); // Use ref to avoid stale closure in onend
  const isSpeakingRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isActiveRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      speechSynthesis.cancel();
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
    isSpeakingRef.current = true;
    
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
      isSpeakingRef.current = false;
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

  const restartRecognition = useCallback(() => {
    if (isActiveRef.current && !isProcessingRef.current && !isSpeakingRef.current && recognitionRef.current) {
      try {
        console.log('Restarting speech recognition...');
        setIsListening(true);
        recognitionRef.current.start();
      } catch (e) {
        console.log('Recognition restart failed:', e);
        // May already be running, ignore
      }
    }
  }, []);

  const processUserInput = useCallback(async (userMessage: string) => {
    if (isProcessingRef.current || !userMessage.trim()) return;
    
    isProcessingRef.current = true;
    setIsProcessing(true);
    setIsListening(false);
    setTranscript('');

    try {
      console.log('Processing user input:', userMessage);
      
      const { data, error } = await supabase.functions.invoke('voice-chat', {
        body: { 
          message: userMessage,
          conversationHistory 
        }
      });

      if (error) throw new Error(error.message);

      const aiResponse = data.response;
      console.log('AI response:', aiResponse);
      setConversationHistory(data.conversationHistory || []);

      // Speak the response
      await speakWithElevenLabs(aiResponse);

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
      
      // Resume listening after speaking completes
      restartRecognition();
    }
  }, [conversationHistory, speakWithElevenLabs, toast, restartRecognition]);

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
      recognition.continuous = true; // Keep listening continuously
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptText;
          } else {
            interimTranscript += transcriptText;
          }
        }

        setTranscript(interimTranscript || finalTranscript);

        if (finalTranscript && finalTranscript.trim()) {
          console.log('Final transcript:', finalTranscript);
          // Stop recognition while processing
          recognition.stop();
          processUserInput(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'not-allowed') {
          toast({
            title: 'Microphone Denied',
            description: 'Please allow microphone access to use voice chat.',
            variant: 'destructive'
          });
          isActiveRef.current = false;
          setIsActive(false);
          setIsListening(false);
        } else if (event.error === 'no-speech') {
          // Normal timeout due to silence, onend will handle restart
          console.log('No speech detected, will auto-restart.');
        } else if (event.error !== 'aborted') {
          toast({
            title: 'Recognition Error',
            description: `Speech error: ${event.error}`,
            variant: 'destructive'
          });
        }
      };

      recognition.onend = () => {
        console.log('Speech recognition ended, isActive:', isActiveRef.current);
        setIsListening(false);
        
        // Auto-restart if session is still active and not processing/speaking
        if (isActiveRef.current && !isProcessingRef.current && !isSpeakingRef.current) {
          console.log('Auto-restarting speech recognition...');
          try {
            setIsListening(true);
            recognition.start();
          } catch (e) {
            console.log('Could not restart:', e);
          }
        }
      };

      recognitionRef.current = recognition;
      isActiveRef.current = true;
      setIsActive(true);
      setIsListening(true);
      setConversationHistory([]);
      
      recognition.start();
      console.log('Speech recognition started');

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
  }, [processUserInput, toast]);

  const stopSession = useCallback(() => {
    console.log('Stopping voice session');
    isActiveRef.current = false;
    
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
