
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Palette, Type } from "lucide-react";
import { getDarkModeDropdownClasses } from '@/utils/darkModeUtils';

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

  const getCurrentShapeColor = () => {
    const color = shapeColors.find(c => c.value === selectedColor);
    return color ? color.color : customColor;
  };

  const getCurrentTextColor = () => {
    const color = textColors.find(c => c.value === selectedTextColor);
    return color ? color.color : customTextColor;
  };

  return (
    <div className="flex items-center gap-3">
      {/* Shape Color Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2"
            aria-label="Select shape color"
          >
            <Palette className="h-4 w-4" />
            <div 
              className="w-4 h-4 rounded-full border border-border"
              style={{ backgroundColor: getCurrentShapeColor() }}
            />
            Shape
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          className={`w-48 ${getDarkModeDropdownClasses()} animate-fade-in`}
        >
          <DropdownMenuLabel>Shape Colors</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {shapeColors.map((color) => (
            <DropdownMenuItem
              key={color.value}
              onClick={() => setSelectedColor(color.value)}
              className="cursor-pointer flex items-center gap-3"
            >
              <div 
                className="w-5 h-5 rounded-full border border-border"
                style={{ backgroundColor: color.color }}
              />
              <span>{color.label}</span>
              {selectedColor === color.value && (
                <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'color';
              input.value = customColor;
              input.onchange = (e) => {
                const target = e.target as HTMLInputElement;
                setCustomColor(target.value);
                setSelectedColor('custom');
              };
              input.click();
            }}
            className="cursor-pointer flex items-center gap-3"
          >
            <div 
              className="w-5 h-5 rounded-full border border-border"
              style={{ backgroundColor: customColor }}
            />
            <span>Custom Color</span>
            {selectedColor === 'custom' && (
              <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Text Color Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2"
            aria-label="Select text color"
          >
            <Type className="h-4 w-4" />
            <div 
              className="w-4 h-4 rounded-full border border-border"
              style={{ backgroundColor: getCurrentTextColor() }}
            />
            Text
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          className={`w-48 ${getDarkModeDropdownClasses()} animate-fade-in`}
        >
          <DropdownMenuLabel>Text Colors</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {textColors.map((color) => (
            <DropdownMenuItem
              key={color.value}
              onClick={() => setSelectedTextColor(color.value)}
              className="cursor-pointer flex items-center gap-3"
            >
              <div 
                className={`w-5 h-5 rounded-full border border-border ${
                  color.color === '#ffffff' ? 'border-2' : ''
                }`}
                style={{ backgroundColor: color.color }}
              />
              <span>{color.label}</span>
              {selectedTextColor === color.value && (
                <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'color';
              input.value = customTextColor;
              input.onchange = (e) => {
                const target = e.target as HTMLInputElement;
                setCustomTextColor(target.value);
                setSelectedTextColor('custom');
              };
              input.click();
            }}
            className="cursor-pointer flex items-center gap-3"
          >
            <div 
              className="w-5 h-5 rounded-full border border-border"
              style={{ backgroundColor: customTextColor }}
            />
            <span>Custom Text</span>
            {selectedTextColor === 'custom' && (
              <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
