
import React from "react";
import { Toggle } from "../ui/toggle";
import { Paintbrush, Highlighter } from "lucide-react";

interface ColorHeaderProps {
  isHighlighter: boolean;
  onHighlighterToggle: (pressed: boolean) => void;
}

export const ColorHeader = ({ isHighlighter, onHighlighterToggle }: ColorHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Paintbrush className="w-4 h-4" />
        <h3 className="font-medium">Colour Tool</h3>
      </div>
      <Toggle
        pressed={isHighlighter}
        onPressedChange={onHighlighterToggle}
        aria-label="Toggle highlighter mode"
        className="data-[state=on]:bg-yellow-200"
      >
        <Highlighter className="w-4 h-4" />
      </Toggle>
    </div>
  );
};
