import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Speaker, SpeakerOff, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

export const SpeechToText = () => {
  const { toast } = useToast();
  const {
    isListening,
    transcript,
    setTranscript,
    startListening,
    stopListening
  } = useSpeechRecognition();

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

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex gap-2">
        <Button
          onClick={isListening ? stopListening : startListening}
          size="sm"
          className="flex-1 bg-workspace-dark text-white hover:bg-workspace-dark/90 h-8 text-xs"
        >
          {isListening ? (
            <>
              <SpeakerOff className="w-3 h-3 mr-1" />
              Stop Recording
            </>
          ) : (
            <>
              <Speaker className="w-3 h-3 mr-1" />
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
    </div>
  );
};