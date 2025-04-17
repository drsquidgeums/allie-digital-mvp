
import React from "react";
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

  const handleMusicSelection = (value: string) => {
    const music = MUSIC_OPTIONS.find((opt) => opt.id === value);
    if (music) {
      handleMusicChange(music);
    }
  };

  const handlePlayToggle = () => {
    const currentMusic = MUSIC_OPTIONS.find(opt => opt.id === selectedMusic);
    togglePlay(currentMusic);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  return (
    <TooltipProvider>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <MusicButton isPlaying={isPlaying} isDisabled={false} />
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
            isDisabled={false}
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
