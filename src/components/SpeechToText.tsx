import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Copy, ArrowUpFromLine, Pencil, Eraser } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePersistedText } from "@/hooks/usePersistedText";
import { useEditorContent } from "@/hooks/useEditorContent";

export const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = usePersistedText("stt");
  const [appendMode, setAppendMode] = useState<'replace' | 'append'>('replace');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const { setEditorText, getTextContent } = useEditorContent();

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
    if (!transcript) {
      toast({
        title: "No text",
        description: "There is no transcript to send to the editor",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (appendMode === 'append') {
        // Get current content and append transcript
        const currentText = getTextContent();
        const combinedText = currentText ? `${currentText}\n\n${transcript}` : transcript;
        setEditorText(combinedText);
        toast({
          title: "Text appended",
          description: "Speech transcript has been appended to the editor"
        });
      } else {
        // Replace editor content
        setEditorText(transcript);
        toast({
          title: "Text replaced",
          description: "Speech transcript has replaced the editor content"
        });
      }
    } catch (error) {
      console.error('Error sending text to editor:', error);
      toast({
        title: "Error",
        description: "Failed to send text to editor",
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
      description: `Editor will now ${appendMode === 'replace' ? 'append to' : 'replace'} existing content`
    });
  };

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
              <span className="truncate">Record</span>
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
          onClick={sendToEditor}
          size="sm"
          variant="outline"
          className="flex-1 h-9 text-xs px-2 min-w-0"
          disabled={!transcript}
          title={appendMode === 'append' ? "Append to editor content" : "Replace editor content"}
        >
          <ArrowUpFromLine className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">Send to Editor</span>
        </Button>
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
        Mode: {appendMode === 'append' ? 'Append' : 'Replace'} - 
        {appendMode === 'append' 
          ? " Text will be added to existing editor content" 
          : " Text will replace existing editor content"}
      </p>
    </div>
  );
};
