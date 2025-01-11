import React from "react";
import { ColorOption } from "./ColorOption";
import { Button } from "../ui/button";
import { ColorListProps } from "./types";

export const ColorList = ({ colors, selectedColor, onColorChange }: ColorListProps) => {
  return (
    <div 
      className="grid grid-cols-1 gap-2"
      role="radiogroup"
      aria-label="Irlen overlay color options"
    >
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
        className="w-full dark:bg-[#333333] dark:text-[#FAFAFA] dark:hover:bg-[#444444] dark:border dark:border-white/20"
        disabled={!selectedColor}
        aria-label="Remove overlay"
      >
        Remove Overlay
      </Button>
    </div>
  );
};