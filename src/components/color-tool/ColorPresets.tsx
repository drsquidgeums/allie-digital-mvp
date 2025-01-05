import React from "react";
import { Button } from "../ui/button";

interface ColorPresetsProps {
  presetColors: string[];
  isHighlighter: boolean;
  onColorSelect: (color: string) => void;
}

export const ColorPresets = ({ presetColors, isHighlighter, onColorSelect }: ColorPresetsProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Preset Colors</label>
      <div className="grid grid-cols-5 gap-2">
        {presetColors.map((color) => (
          <Button
            key={color}
            className="w-full h-8 transition-transform hover:scale-105"
            style={{ 
              backgroundColor: isHighlighter ? `${color}40` : color,
              border: isHighlighter ? `2px solid ${color}` : 'none'
            }}
            onClick={() => onColorSelect(color)}
          />
        ))}
      </div>
    </div>
  );
};