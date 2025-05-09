
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MUSIC_OPTIONS } from "./MusicOptions";

interface MusicSelectorProps {
  selectedMusic: string;
  handleMusicSelection: (value: string) => void;
}

const MusicSelector = ({
  selectedMusic,
  handleMusicSelection,
}: MusicSelectorProps) => {
  return (
    <div className="space-y-2">
      <RadioGroup
        defaultValue={selectedMusic}
        onValueChange={handleMusicSelection}
      >
        {MUSIC_OPTIONS.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={option.id}
              id={option.id}
            />
            <Label htmlFor={option.id}>{option.name}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default MusicSelector;
