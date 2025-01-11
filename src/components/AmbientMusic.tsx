import React from "react";
import { Button } from "./ui/button";
import { Music } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MUSIC_OPTIONS } from "./audio/MusicOptions";
import { useAudioPlayer } from "./audio/useAudioPlayer";

export const AmbientMusic = () => {
  const { isPlaying, selectedMusic, handleMusicChange, togglePlay } = useAudioPlayer();

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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-9 w-9 relative bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
            isPlaying ? "text-primary ring-2 ring-primary" : ""
          }`}
          aria-label={`Ambient Music ${isPlaying ? 'Playing' : 'Paused'}`}
        >
          <Music className="h-4 w-4" aria-hidden="true" />
          {isPlaying && (
            <div 
              className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
              role="status"
              aria-label="Music playing"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-64 dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]" 
        align="end"
        role="dialog"
        aria-label="Ambient Music Settings"
      >
        <div className="space-y-4">
          <div className="font-medium text-sm mb-2">Ambient Music</div>
          <RadioGroup
            value={selectedMusic}
            onValueChange={handleMusicSelection}
            className="space-y-2"
            aria-label="Select background music"
          >
            {MUSIC_OPTIONS.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option.id} 
                  id={option.id}
                  aria-label={option.name}
                />
                <Label 
                  htmlFor={option.id}
                  className="flex-1 text-left cursor-pointer"
                >
                  {option.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
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
      </PopoverContent>
    </Popover>
  );
};