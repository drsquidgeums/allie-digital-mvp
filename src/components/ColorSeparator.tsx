import React from "react";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "./ui/alert";
import { ColorHeader } from "./color-tool/ColorHeader";
import { ColorPresets } from "./color-tool/ColorPresets";

interface ColorSeparatorProps {
  onColorChange?: (color: string, isHighlighter?: boolean) => void;
}

export const ColorSeparator = ({ onColorChange }: ColorSeparatorProps = {}) => {
  const [selectedColor, setSelectedColor] = React.useState("#000000");
  const [hexInput, setHexInput] = React.useState("#000000");
  const [isHighlighter, setIsHighlighter] = React.useState(false);
  const { toast } = useToast();

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setHexInput(color);
    if (onColorChange) {
      onColorChange(color, isHighlighter);
      toast({
        title: isHighlighter ? "Highlighter color selected" : "Color selected",
        description: "Now highlight text in the document to apply this color",
      });
    }
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexInput(value);
    
    // Validate hex color format
    const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(value);
    if (isValidHex) {
      handleColorChange(value);
    }
  };

  const toggleHighlighter = (pressed: boolean) => {
    setIsHighlighter(pressed);
    if (onColorChange) {
      onColorChange(selectedColor, pressed);
      toast({
        title: pressed ? "Highlighter mode enabled" : "Text color mode enabled",
        description: "Now highlight text in the document to apply this effect",
      });
    }
  };

  const presetColors = [
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#9b87f5", // Primary Purple
    "#7E69AB", // Secondary Purple
    "#D6BCFA", // Light Purple
    "#F2FCE2", // Soft Green
    "#FEC6A1", // Soft Orange
  ];

  return (
    <div className="p-4 space-y-4">
      <ColorHeader 
        isHighlighter={isHighlighter} 
        onHighlighterToggle={toggleHighlighter} 
      />

      <Alert>
        <AlertDescription>
          1. {isHighlighter ? "Toggle highlighter mode" : "Select a color"} below
          <br />
          2. Highlight text in your document
          <br />
          3. The highlighted text will automatically change
        </AlertDescription>
      </Alert>
      
      <div className="relative">
        <Input
          type="color"
          value={selectedColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-full h-40 p-0 border-2 rounded-lg cursor-pointer"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Hex Color</label>
        <Input
          type="text"
          value={hexInput}
          onChange={handleHexInputChange}
          placeholder="#000000"
          className="font-mono"
          pattern="^#[0-9A-Fa-f]{6}$"
        />
      </div>

      <ColorPresets 
        presetColors={presetColors}
        isHighlighter={isHighlighter}
        onColorSelect={handleColorChange}
      />
    </div>
  );
};