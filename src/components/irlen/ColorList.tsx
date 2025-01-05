import React from "react";
import { ColorOption } from "./ColorOption";
import { Button } from "../ui/button";

interface Color {
  name: string;
  value: string;
}

interface ColorListProps {
  colors: Color[];
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export const ColorList = ({ colors, selectedColor, onColorChange }: ColorListProps) => {
  return (
    <div className="grid grid-cols-1 gap-2">
      {colors.map((color) => (
        <ColorOption
          key={color.name}
          name={color.name}
          value={color.value}
          isSelected={selectedColor === color.value}
          onClick={() => onColorChange(color.value)}
        />
      ))}
      <Button 
        onClick={() => onColorChange("")}
        variant="outline" 
        className="w-full"
        disabled={!selectedColor}
      >
        Remove Overlay
      </Button>
    </div>
  );
};