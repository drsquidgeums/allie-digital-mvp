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
          className={`h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground ${
            isPlaying ? "text-primary" : ""
          }`}
          title="Ambient Music"
        >
          <Music className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-popover text-popover-foreground border-border" align="end">
        <div className="space-y-4">
          <div className="font-medium text-sm">Ambient Music</div>
          <RadioGroup
            value={selectedMusic}
            onValueChange={handleMusicSelection}
            className="space-y-2"
          >
            {MUSIC_OPTIONS.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id}>{option.name}</Label>
              </div>
            ))}
          </RadioGroup>
          <Button
            onClick={handlePlayToggle}
            className="w-full"
            variant={isPlaying ? "destructive" : "default"}
          >
            {isPlaying ? "Stop Music" : "Play Music"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};