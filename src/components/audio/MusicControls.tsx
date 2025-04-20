
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Volume2, VolumeX, Repeat } from "lucide-react";

interface MusicControlsProps {
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  handleVolumeChange: (value: number[]) => void;
  toggleMute: () => void;
  toggleLoop: () => void;
}

export const MusicControls = ({
  volume,
  isMuted,
  isLooping,
  handleVolumeChange,
  toggleMute,
  toggleLoop,
}: MusicControlsProps) => {
  return (
    <div className="space-y-2">
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
    </div>
  );
};
