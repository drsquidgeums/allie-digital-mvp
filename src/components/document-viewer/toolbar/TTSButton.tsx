import { Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";
import { useEditorContent } from "@/hooks/useEditorContent";
import { notifyAICreditsUsed } from "@/utils/aiCreditsEvent";
import { handleAIUsageLimitError } from "@/utils/aiUsageLimitHandler";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useElevenLabsBYOKPrompt } from "@/hooks/useElevenLabsBYOKPrompt";
import { ElevenLabsBYOKPrompt } from "@/components/byok/ElevenLabsBYOKPrompt";

const ELEVENLABS_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Sarah - Warm & Clear

export const TTSButton = () => {
  const { t } = useTranslation();
  const { getSelectedText } = useEditorContent();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { showPrompt, triggerPrompt, dismissPrompt } = useElevenLabsBYOKPrompt();

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);


  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleClick = async () => {
    // If already playing, stop
    if (isPlaying) {
      stopAudio();
      toast({
        title: "Stopped",
        description: "Text-to-speech stopped"
      });
      return;
    }

    const selectedText = getSelectedText();
    
    if (!selectedText || !selectedText.trim()) {
      toast({
        title: "No text selected",
        description: "Please highlight some text in the editor to read aloud",
        variant: "destructive"
      });
      return;
    }

    triggerPrompt();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: { text: selectedText, voiceId: ELEVENLABS_VOICE_ID }
      });

      if (error) {
        if (handleAIUsageLimitError(error)) return;
        throw new Error(error.message || "Failed to generate speech");
      }

      if (!data?.audioContent) {
        throw new Error("No audio data received");
      }

      // Convert base64 to audio blob
      notifyAICreditsUsed();
      const binaryString = atob(data.audioContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        audioRef.current = null;
        URL.revokeObjectURL(audioUrl);
        toast({
          title: "Playback Error",
          description: "Failed to play audio",
          variant: "destructive"
        });
      };

      audio.play();
      setIsPlaying(true);

      toast({
        title: "Playing",
        description: "Reading selected text aloud"
      });
    } catch (error) {
      console.error("TTS error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate speech",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  // Listen for keyboard shortcut event
  useEffect(() => {
    const handler = () => handleClick();
    window.addEventListener('shortcut:toggle-tts', handler);
    return () => window.removeEventListener('shortcut:toggle-tts', handler);
  });


  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={isLoading}
          className={`h-9 w-9 relative bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
            isPlaying ? 'bg-primary text-primary-foreground ring-2 ring-primary' : ''
          }`}
          aria-label={isPlaying ? 'Stop reading' : 'Read selected text aloud'}
        >
          {isPlaying ? (
            <Square className="h-4 w-4" />
          ) : (
            <Mic className={`h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />
          )}
          {isPlaying && (
            <div 
              className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
              role="status"
              aria-label="Audio playing"
            />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom"
        className="bg-popover text-popover-foreground px-3 py-2 text-sm max-w-48 text-center"
      >
        {isPlaying ? 'Stop reading' : (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">{t('tools.tts') || 'Read Aloud'}</span>
            <span className="text-xs text-muted-foreground">Highlight text first</span>
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
};
