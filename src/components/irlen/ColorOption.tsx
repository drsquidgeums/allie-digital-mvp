import React from "react";
import { Button } from "../ui/button";

interface ColorOptionProps {
  name: string;
  value: string;
  isSelected: boolean;
  onClick: () => void;
}

export const ColorOption = ({ name, value, isSelected, onClick }: ColorOptionProps) => {
  return (
    <Button
      onClick={onClick}
      className="w-full flex items-center gap-2"
      variant={isSelected ? "secondary" : "outline"}
    >
      <div 
        className="w-4 h-4 rounded"
        style={{ backgroundColor: value }}
      />
      {name}
    </Button>
  );
};