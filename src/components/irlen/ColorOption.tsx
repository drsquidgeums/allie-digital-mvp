import React from "react";
import { Button } from "../ui/button";
import { ColorOptionProps } from "./types";

export const ColorOption = ({ name, value, isSelected, onClick }: ColorOptionProps) => {
  return (
    <Button
      onClick={onClick}
      className={`w-full flex items-center gap-2 dark:bg-[#333333] dark:text-[#FAFAFA] dark:hover:bg-[#444444] dark:border dark:border-white/20 ${
        isSelected ? 'dark:bg-transparent ring-2 ring-primary' : ''
      }`}
      variant={isSelected ? "secondary" : "outline"}
      aria-pressed={isSelected}
      aria-label={`${name} overlay color${isSelected ? ' (selected)' : ''}`}
    >
      <div 
        className="w-4 h-4 rounded border border-border"
        style={{ backgroundColor: value }}
        role="presentation"
      />
      <span className="flex-1 text-left">{name}</span>
    </Button>
  );
};