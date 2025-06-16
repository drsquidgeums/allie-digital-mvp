
import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MUSIC_OPTIONS } from "./audio/MusicOptions";
import { useAudioPlayer } from "./audio/useAudioPlayer";
import { MusicButton } from "./audio/MusicButton";
import { MusicPopoverContent } from "./audio/MusicPopoverContent";
import { AudioErrorBoundary } from "./error-boundaries/AudioErrorBoundary";

export const AmbientMusic = () => {
  const { 
    isPlaying, 
    selectedMusic, 
    volume,
    isLooping,
    isMuted,
    handleMusicChange, 
    togglePlay,
    setVolume,
    toggleMute,
    toggleLoop 
  } = useAudioPlayer();
  
  const [isDisabled, setIsDisabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Listen for audio disable events
  useEffect(() => {
    const handleDisableAudio = () => {
      setIsDisabled(true);
      setIsOpen(false);
    };

    window.addEventListener('disableAudio', handleDisableAudio);
    
    return () => {
      window.removeEventListener('disableAudio', handleDisableAudio);
    };
  }, []);

  const handleMusicSelection = (value: string) => {
    if (isDisabled) return;
    
    const music = MUSIC_OPTIONS.find((opt) => opt.id === value);
    if (music) {
      handleMusicChange(music);
    }
  };

  const handlePlayToggle = () => {
    if (isDisabled) return;
    
    // Find current music selection if available
    const currentMusic = MUSIC_OPTIONS.find(opt => opt.id === selectedMusic) || 
                         (selectedMusic ? undefined : MUSIC_OPTIONS[0]);
    
    togglePlay(currentMusic);
  };

  const handleVolumeChange = (value: number[]) => {
    if (isDisabled) return;
    
    setVolume(value[0]);
  };

  return (
    <AudioErrorBoundary>
      <TooltipProvider>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <MusicButton isPlaying={isPlaying} isDisabled={isDisabled} />
              </div>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom"
              className="z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md"
            >
              Ambient Music
            </TooltipContent>
          </Tooltip>
          <PopoverContent 
            className="w-64 dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]" 
            align="end"
          >
            <MusicPopoverContent 
              isDisabled={isDisabled}
              selectedMusic={selectedMusic}
              isPlaying={isPlaying}
              volume={volume}
              isMuted={isMuted}
              isLooping={isLooping}
              handleMusicSelection={handleMusicSelection}
              handlePlayToggle={handlePlayToggle}
              handleVolumeChange={handleVolumeChange}
              toggleMute={toggleMute}
              toggleLoop={toggleLoop}
            />
          </PopoverContent>
        </Popover>
      </TooltipProvider>
    </AudioErrorBoundary>
  );
};
