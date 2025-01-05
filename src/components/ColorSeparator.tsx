import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Paintbrush } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "./ui/alert";

interface ColorSeparatorProps {
  onColorChange?: (color: string) => void;
}

export const ColorSeparator = ({ onColorChange }: ColorSeparatorProps = {}) => {
  const [selectedColor, setSelectedColor] = React.useState("#000000");
  const [hexInput, setHexInput] = React.useState("#000000");
  const { toast } = useToast();

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setHexInput(color);
    if (onColorChange) {
      onColorChange(color);
      toast({
        title: "Color selected",
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
      <div className="flex items-center gap-2">
        <Paintbrush className="w-4 h-4" />
        <h3 className="font-medium">Color Tool</h3>
      </div>

      <Alert>
        <AlertDescription>
          1. Select a color below
          <br />
          2. Highlight text in your document
          <br />
          3. The highlighted text will automatically change to your selected color
        </AlertDescription>
      </Alert>
      
      {/* Color Wheel */}
      <div className="relative">
        <Input
          type="color"
          value={selectedColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-full h-40 p-0 border-2 rounded-lg cursor-pointer"
        />
      </div>

      {/* Hex Input */}
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

      {/* Preset Colors */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Preset Colors</label>
        <div className="grid grid-cols-5 gap-2">
          {presetColors.map((color) => (
            <Button
              key={color}
              className="w-full h-8 transition-transform hover:scale-105"
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};