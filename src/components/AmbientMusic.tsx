
import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
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
import { useFocusSettings } from "@/hooks/useFocusSettings";
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
  
  const { isFocusModeActive, focusModeSettings } = useFocusMode();
  const { settings } = useFocusSettings();

  // Only disable if both focus mode is active AND muteAudio is enabled in the user's actual settings
  // Not based on the modified settings from focusModeSettings
  const [isDisabled, setIsDisabled] = useState(false);
  
  useEffect(() => {
    // Never disable the music player during focus mode
    // We intentionally ignore the focusModeSettings.muteAudio (which is always false)
    // and only check the user's actual settings which they might have manually enabled
    setIsDisabled(false);
    
    console.log('Focus mode state in ambient player:', { isFocusModeActive, settings });
  }, [isFocusModeActive, settings]);

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
          <TooltipTrigger>
            <MusicButton isPlaying={isPlaying} isDisabled={isDisabled} />
          </TooltipTrigger>
          <TooltipContent 
            side="bottom"
            className="z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md"
          >
            {isDisabled ? "Music disabled during Focus Mode" : "Ambient Music"}
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
