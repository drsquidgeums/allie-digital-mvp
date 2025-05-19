
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Copy, ArrowUpFromLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePersistedText } from "@/hooks/usePersistedText";
import { useEditorContent } from "@/hooks/useEditorContent";

export const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = usePersistedText("stt");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const { setEditorText } = useEditorContent();

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in your browser",
        variant: "destructive"
      });
      return;
    }

    recognitionRef.current = new webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

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
        title: "Error",
        description: "There was an error with speech recognition",
        variant: "destructive"
      });
    };

    recognitionRef.current.start();
    setIsListening(true);
    toast({
      title: "Listening",
      description: "Speech recognition started"
    });
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

  // Send transcript to editor
  const sendToEditor = () => {
    if (transcript) {
      setEditorText(transcript);
      toast({
        title: "Text sent",
        description: "Speech transcript has been sent to the editor"
      });
    } else {
      toast({
        title: "No text",
        description: "There is no transcript to send to the editor",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex gap-2">
        <Button
          onClick={isListening ? stopListening : startListening}
          size="sm"
          variant="outline" 
          className="flex-1 h-8 text-xs"
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
          className="flex-1 h-8 text-xs"
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
      <Button
        onClick={sendToEditor}
        size="sm"
        variant="outline"
        className="w-full h-8 text-xs"
        disabled={!transcript}
      >
        <ArrowUpFromLine className="w-3 h-3 mr-1" />
        Send to Editor
      </Button>
    </div>
  );
};
