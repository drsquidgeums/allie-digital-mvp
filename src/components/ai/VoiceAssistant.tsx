import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aiEnhancementService } from '@/services/ai/AIEnhancementService';

interface VoiceAssistantProps {
  className?: string;
  onResponse?: (response: string) => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ 
  className = '', 
  onResponse 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition and synthesis
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for speech recognition support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
      }

      // Check for speech synthesis support
      if (window.speechSynthesis) {
        synthRef.current = window.speechSynthesis;
      }

      setIsEnabled(!!(recognitionRef.current && synthRef.current));
    }
  }, []);

  const startListening = async () => {
    if (!recognitionRef.current || !isEnabled) {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support voice features.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsListening(true);
      
      recognitionRef.current.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice input:', transcript);
        
        // Get AI response
        const response = await aiEnhancementService.generateVoiceInsight(
          transcript, 
          'Voice assistance request'
        );
        
        // Speak the response
        if (response) {
          await speakResponse(response);
          onResponse?.(response);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice recognition error",
          description: "Please try again.",
          variant: "destructive"
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);
      toast({
        title: "Voice error",
        description: "Could not start voice recognition.",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const speakResponse = async (text: string): Promise<void> => {
    if (!synthRef.current || !isEnabled) return;

    return new Promise((resolve) => {
      setIsSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        resolve();
      };

      synthRef.current.speak(utterance);
    });
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isEnabled) {
    return null; // Don't render if voice features aren't supported
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant={isListening ? "destructive" : "outline"}
        size="sm"
        onClick={isListening ? stopListening : startListening}
        disabled={isSpeaking}
        className="h-8 w-8 p-0"
        title={isListening ? "Stop listening" : "Start voice input"}
      >
        {isListening ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>

      {isSpeaking && (
        <Button
          variant="outline"
          size="sm"
          onClick={stopSpeaking}
          className="h-8 w-8 p-0"
          title="Stop speaking"
        >
          <VolumeX className="h-4 w-4" />
        </Button>
      )}

      {isListening && (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">Listening...</span>
        </div>
      )}

      {isSpeaking && (
        <div className="flex items-center gap-1">
          <Volume2 className="h-3 w-3 text-primary animate-pulse" />
          <span className="text-xs text-muted-foreground">Speaking...</span>
        </div>
      )}
    </div>
  );
};