import React from "react";
import { Button } from "../ui/button";
import { ColorOptionProps } from "./types";

export const ColorOption = ({ name, value, isSelected, onClick }: ColorOptionProps) => {
  return (
    <Button
      onClick={onClick}
      className={`w-full flex items-center gap-2 dark:bg-[#333333] dark:text-[#FAFAFA] dark:hover:bg-[#444444] dark:border dark:border-white/20 ${
        isSelected ? 'dark:bg-transparent' : ''
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