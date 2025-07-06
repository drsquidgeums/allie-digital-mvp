
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Copy, ArrowUpFromLine, Pencil, Eraser } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePersistedText } from "@/hooks/usePersistedText";

export const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = usePersistedText("stt");
  const [appendMode, setAppendMode] = useState<'replace' | 'append'>('replace');
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
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopListening();
        toast({
          title: "Recognition Error",
          description: `Speech recognition failed: ${event.error}`,
          variant: "destructive"
        });
      };

      recognitionRef.current.onend = () => {
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
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive"
      });
    }
  };

  // Clear transcript
  const clearTranscript = () => {
    setTranscript('');
    toast({
      title: "Cleared",
      description: "Speech transcript has been cleared"
    });
  };

  // Toggle append mode
  const toggleAppendMode = () => {
    setAppendMode(prev => prev === 'replace' ? 'append' : 'replace');
    toast({
      title: "Mode changed",
      description: `Mode changed to ${appendMode === 'replace' ? 'append' : 'replace'}`
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
          className="flex-1 h-9 text-xs px-2 min-w-0"
        >
          {isListening ? (
            <>
              <MicOff className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">Stop Recording</span>
            </>
          ) : (
            <>
              <Mic className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">Start Recording</span>
            </>
          )}
        </Button>
        <Button
          onClick={copyToClipboard}
          size="sm"
          variant="outline"
          className="flex-1 h-9 text-xs px-2 min-w-0"
          disabled={!transcript}
        >
          <Copy className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">Copy Text</span>
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
          onClick={toggleAppendMode}
          size="sm"
          variant="outline"
          className="h-9 text-xs px-2"
          title="Toggle between replace and append mode"
        >
          {appendMode === 'append' ? <Pencil className="w-3 h-3" /> : <Eraser className="w-3 h-3" />}
        </Button>
        <Button
          onClick={clearTranscript}
          size="sm"
          variant="outline"
          className="h-9 text-xs px-3"
          disabled={!transcript}
          title="Clear transcript"
        >
          <Eraser className="w-3 h-3" />
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Mode: {appendMode === 'append' ? 'Append' : 'Replace'}
        {isListening && " • Recording..."}
      </p>
    </div>
  );
};
