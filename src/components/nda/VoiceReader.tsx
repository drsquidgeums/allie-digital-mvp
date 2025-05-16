
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Pause } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface VoiceReaderProps {
  text: string;
}

export const VoiceReader: React.FC<VoiceReaderProps> = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  const handleToggleAudio = () => {
    if (isPlaying) {
      // Stop reading
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // Start reading
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Add event listener for when speech ends
      utterance.onend = () => {
        setIsPlaying(false);
      };

      // Find English voice if available
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Female')
      ) || voices.find(voice => voice.lang.includes('en')) || voices[0];
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.rate = 0.9; // Slightly slower than normal
      speechSynthesisRef.current = utterance;
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);

      toast({
        title: isPlaying ? "Audio Stopped" : "Reading Agreement",
        description: isPlaying ? "Text-to-speech stopped" : "NDA agreement is being read aloud"
      });
    }
  };

  // Ensure speech synthesis is canceled when component unmounts
  useEffect(() => {
    return () => {
      if (isPlaying) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying]);

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      onClick={handleToggleAudio}
      className="absolute right-0 top-0"
      aria-label={isPlaying ? "Stop reading" : "Read agreement aloud"}
      aria-pressed={isPlaying}
      title={isPlaying ? "Stop reading" : "Read agreement aloud"}
    >
      <span className="sr-only">{isPlaying ? "Stop reading" : "Read agreement aloud"}</span>
      {isPlaying ? (
        <Pause className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Volume2 className="h-4 w-4" aria-hidden="true" />
      )}
    </Button>
  );
};
