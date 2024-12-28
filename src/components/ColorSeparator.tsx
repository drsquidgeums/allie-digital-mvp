import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Paintbrush } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ColorSeparator = () => {
  const [selectedColor, setSelectedColor] = useState("#000000");
  const { toast } = useToast();

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    toast({
      title: "Color selected",
      description: "Click on text to apply this color",
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Paintbrush className="w-4 h-4" />
        <h3 className="font-medium">Color Separator</h3>
      </div>
      <Input
        type="color"
        value={selectedColor}
        onChange={(e) => handleColorChange(e.target.value)}
        className="w-full h-10"
      />
      <div className="grid grid-cols-5 gap-2">
        {["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"].map((color) => (
          <Button
            key={color}
            className="w-full h-8"
            style={{ backgroundColor: color }}
            onClick={() => handleColorChange(color)}
          />
        ))}
      </div>
    </div>
  );
};