
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Copy, Eraser } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePersistedText } from "@/hooks/usePersistedText";

export const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = usePersistedText("stt");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  // Check if speech recognition is supported
  useEffect(() => {
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupported(supported);
    console.log('Speech recognition supported:', supported);
  }, []);

  const startListening = () => {
    if (!isSupported) {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in your browser. Try Chrome or Edge.",
        variant: "destructive"
      });
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        console.log('Speech recognition result:', currentTranscript);
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = "Speech recognition failed";
        switch(event.error) {
          case 'network':
            errorMessage = "Network error - check your internet connection";
            break;
          case 'not-allowed':
            errorMessage = "Microphone access denied - please allow microphone permission";
            break;
          case 'no-speech':
            errorMessage = "No speech detected - try speaking louder";
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        toast({
          title: "Recognition Error",
          description: errorMessage,
          variant: "destructive"
        });
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      recognitionRef.current.start();
      setIsListening(true);
      toast({
        title: "Listening",
        description: "Speech recognition started. Speak now!"
      });
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
      toast({
        title: "Error",
        description: "Failed to start speech recognition",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast({
        title: "Stopped",
        description: "Speech recognition stopped"
      });
    }
  };

  const copyToClipboard = async () => {
    if (!transcript) {
      toast({
        title: "No text",
        description: "There is no transcript to copy",
        variant: "destructive"
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(transcript);
      toast({
        title: "Copied",
        description: "Text copied to clipboard"
      });
    } catch (err) {
      console.error('Copy failed:', err);
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive"
      });
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    toast({
      title: "Cleared",
      description: "Speech transcript has been cleared"
    });
  };

  if (!isSupported) {
    return (
      <div className="p-4 space-y-4 animate-fade-in">
        <div className="text-center text-muted-foreground">
          <Mic className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Speech recognition is not supported in your browser.</p>
          <p className="text-sm">Try using Chrome, Edge, or Safari.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex gap-2">
        <Button
          onClick={isListening ? stopListening : startListening}
          size="sm"
          variant="outline" 
          className="flex-1 h-9 text-xs"
        >
          {isListening ? (
            <>
              <MicOff className="w-3 h-3 mr-1" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-3 h-3 mr-1" />
              Start Recording
            </>
          )}
        </Button>
        <Button
          onClick={copyToClipboard}
          size="sm"
          variant="outline"
          className="flex-1 h-9 text-xs"
          disabled={!transcript}
        >
          <Copy className="w-3 h-3 mr-1" />
          Copy Text
        </Button>
      </div>
      
      <Textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Your speech will appear here..."
        className="min-h-[200px]"
      />
      
      <div className="flex gap-2">
        <Button
          onClick={clearTranscript}
          size="sm"
          variant="outline"
          className="h-9 text-xs"
          disabled={!transcript}
        >
          <Eraser className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </div>
      
      {isListening && (
        <p className="text-xs text-muted-foreground">
          🔴 Recording... Speak now
        </p>
      )}
    </div>
  );
};
