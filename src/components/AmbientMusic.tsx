import React, { useState } from "react";
import { Button } from "./ui/button";
import { Music, Volume2, VolumeX, Repeat } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { MUSIC_OPTIONS } from "./audio/MusicOptions";
import { useAudioPlayer } from "./audio/useAudioPlayer";

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
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`h-9 w-9 relative bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                isPlaying ? "text-primary ring-2 ring-primary" : ""
              }`}
            >
              <Music className="h-4 w-4" />
              {isPlaying && (
                <div 
                  className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                  role="status"
                  aria-label="Music playing"
                />
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom"
          className="bg-popover text-popover-foreground px-3 py-1.5 text-sm"
        >
          Ambient Music
        </TooltipContent>
      </Tooltip>
      <PopoverContent 
        className="w-64 dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]" 
        align="end"
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="volume-control" className="text-sm">
                Volume
              </Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </div>
            <Slider
              id="volume-control"
              min={0}
              max={100}
              step={1}
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={handleVolumeChange}
              className="cursor-pointer"
              aria-label="Adjust volume"
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="loop-toggle" className="text-sm cursor-pointer">
              Loop Playback
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="loop-toggle"
                checked={isLooping}
                onCheckedChange={toggleLoop}
                aria-label="Toggle loop playback"
              />
              <Repeat 
                className={`h-4 w-4 ${isLooping ? 'text-primary' : 'text-muted-foreground'}`}
                aria-hidden="true"
              />
            </div>
          </div>

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