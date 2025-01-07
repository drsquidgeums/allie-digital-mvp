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
      className={`w-full flex items-center gap-2 dark:bg-gray-800 dark:text-[#FAFAFA] dark:hover:bg-gray-700 dark:border dark:border-white/20 ${
        isSelected ? 'bg-accent text-accent-foreground' : 'bg-background'
      }`}
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