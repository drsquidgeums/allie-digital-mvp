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
      className={`w-full flex items-center gap-2 bg-background hover:bg-accent ${
        isSelected ? 'bg-accent' : ''
      }`}
      variant={isSelected ? "secondary" : "outline"}
    >
      <div 
        className="w-4 h-4 rounded"
        style={{ 
          backgroundColor: value,
          border: '1px solid rgba(0,0,0,0.1)'
        }}
      />
      {name}
    </Button>
  );
};