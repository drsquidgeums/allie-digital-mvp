
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Palette, Type } from "lucide-react";

interface VisualColorSelectorProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  selectedTextColor: string;
  setSelectedTextColor: (color: string) => void;
  customTextColor: string;
  setCustomTextColor: (color: string) => void;
}

export const VisualColorSelector: React.FC<VisualColorSelectorProps> = ({
  selectedColor,
  setSelectedColor,
  customColor,
  setCustomColor,
  selectedTextColor,
  setSelectedTextColor,
  customTextColor,
  setCustomTextColor,
}) => {
  const shapeColors = [
    { value: 'hsl(var(--primary))', label: 'Primary', color: '#9b87f5' },
    { value: 'hsl(var(--secondary))', label: 'Secondary', color: '#7c3aed' },
    { value: 'hsl(var(--accent))', label: 'Accent', color: '#f59e0b' },
    { value: '#ef4444', label: 'Red', color: '#ef4444' },
    { value: '#10b981', label: 'Green', color: '#10b981' },
    { value: '#3b82f6', label: 'Blue', color: '#3b82f6' },
    { value: '#f59e0b', label: 'Yellow', color: '#f59e0b' },
    { value: '#8b5cf6', label: 'Purple', color: '#8b5cf6' },
  ];

  const textColors = [
    { value: 'auto', label: 'Auto', color: '#666666' },
    { value: 'hsl(var(--foreground))', label: 'Default', color: '#000000' },
    { value: '#ffffff', label: 'White', color: '#ffffff' },
    { value: '#000000', label: 'Black', color: '#000000' },
    { value: '#ef4444', label: 'Red', color: '#ef4444' },
    { value: '#10b981', label: 'Green', color: '#10b981' },
  ];

  return (
    <div className="flex items-center gap-3">
      <Card className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm">
        <Palette className="h-4 w-4 text-muted-foreground" />
        <div className="flex gap-1">
          {shapeColors.map((color) => (
            <Tooltip key={color.value}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 rounded-full p-0 hover:scale-110 transition-all duration-200 ${
                    selectedColor === color.value ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: color.color }}
                  onClick={() => setSelectedColor(color.value)}
                />
              </TooltipTrigger>
              <TooltipContent>{color.label}</TooltipContent>
            </Tooltip>
          ))}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    setSelectedColor('custom');
                  }}
                  className="h-8 w-8 rounded-full border-2 border-border cursor-pointer hover:scale-110 transition-all duration-200"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>Custom Color</TooltipContent>
          </Tooltip>
        </div>
      </Card>

      <Card className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm">
        <Type className="h-4 w-4 text-muted-foreground" />
        <div className="flex gap-1">
          {textColors.map((color) => (
            <Tooltip key={color.value}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 rounded-full p-0 hover:scale-110 transition-all duration-200 ${
                    selectedTextColor === color.value ? 'ring-2 ring-primary ring-offset-2' : ''
                  } ${color.color === '#ffffff' ? 'border border-border' : ''}`}
                  style={{ backgroundColor: color.color }}
                  onClick={() => setSelectedTextColor(color.value)}
                />
              </TooltipTrigger>
              <TooltipContent>{color.label} Text</TooltipContent>
            </Tooltip>
          ))}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <input
                  type="color"
                  value={customTextColor}
                  onChange={(e) => {
                    setCustomTextColor(e.target.value);
                    setSelectedTextColor('custom');
                  }}
                  className="h-8 w-8 rounded-full border-2 border-border cursor-pointer hover:scale-110 transition-all duration-200"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>Custom Text</TooltipContent>
          </Tooltip>
        </div>
      </Card>
    </div>
  );
};
