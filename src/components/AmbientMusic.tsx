
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
import { useFocusMode } from "@/hooks/useFocusMode";
import { MusicButton } from "./audio/MusicButton";
import { MusicPopoverContent } from "./audio/MusicPopoverContent";

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
  
  // We're no longer setting isDisabled based on focus mode
  const [isDisabled, setIsDisabled] = useState(false);
  
  const handleMusicSelection = (value: string) => {
    if (isDisabled) return;
    
    const music = MUSIC_OPTIONS.find((opt) => opt.id === value);
    if (music) {
      handleMusicChange(music);
    }
  };

  const handlePlayToggle = () => {
    if (isDisabled) return;
    
    const currentMusic = MUSIC_OPTIONS.find(opt => opt.id === selectedMusic);
    togglePlay(currentMusic);
  };

  const handleVolumeChange = (value: number[]) => {
    if (isDisabled) return;
    
    setVolume(value[0]);
  };

  return (
    <TooltipProvider>
      <Popover>
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
  );
};
