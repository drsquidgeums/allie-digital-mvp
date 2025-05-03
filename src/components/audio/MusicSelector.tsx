
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MUSIC_OPTIONS } from "./MusicOptions";

interface MusicSelectorProps {
  selectedMusic: string;
  handleMusicSelection: (value: string) => void;
}

export const MusicSelector = ({
  selectedMusic,
  handleMusicSelection,
}: MusicSelectorProps) => {
  return (
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
  );
};

export default { MusicSelector };
