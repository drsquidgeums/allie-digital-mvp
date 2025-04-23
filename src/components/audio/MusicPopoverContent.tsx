
import React from "react";
import { Button } from "@/components/ui/button";
import { MusicOption } from "./MusicOptions";
import { MusicSelector } from "./MusicSelector";
import { MusicControls } from "./MusicControls";

interface MusicPopoverContentProps {
  isDisabled: boolean;
  selectedMusic: string;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  handleMusicSelection: (value: string) => void;
  handlePlayToggle: () => void;
  handleVolumeChange: (value: number[]) => void;
  toggleMute: () => void;
  toggleLoop: () => void;
}

export const MusicPopoverContent = ({
  isDisabled,
  selectedMusic,
  isPlaying,
  volume,
  isMuted,
  isLooping,
  handleMusicSelection,
  handlePlayToggle,
  handleVolumeChange,
  toggleMute,
  toggleLoop,
}: MusicPopoverContentProps) => {
  if (isDisabled) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Music player is disabled while Focus Mode is active with "Mute Audio" setting enabled.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="font-medium text-sm mb-2">Ambient Music</div>
      
      <MusicSelector 
        selectedMusic={selectedMusic} 
        handleMusicSelection={handleMusicSelection} 
      />

      <MusicControls
        volume={volume}
        isMuted={isMuted}
        isLooping={isLooping}
        handleVolumeChange={handleVolumeChange}
        toggleMute={toggleMute}
        toggleLoop={toggleLoop}
      />

      <Button
        onClick={handlePlayToggle}
        className={`w-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
          isPlaying 
            ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" 
            : "bg-primary hover:bg-primary/90 text-primary-foreground"
        }`}
        aria-label={isPlaying ? "Stop music playback" : "Start music playback"}
      >
        {isPlaying ? "Stop Music" : "Play Music"}
      </Button>
    </div>
  );
};
