import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  CircleDot, 
  Square, 
  Triangle, 
  Diamond, 
  Hexagon, 
  Star, 
  Palette,
  Type,
  Image,
  Sticker
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";

interface MindMapCreativeToolbarProps {
  onShapeSelect: (shape: string, label?: string) => void;
}

export const MindMapCreativeToolbar = ({
  onShapeSelect
}: MindMapCreativeToolbarProps) => {
  const shapes = [
    { id: 'circle', icon: CircleDot, label: 'Circle Node' },
    { id: 'square', icon: Square, label: 'Square Node' },
    { id: 'triangle', icon: Triangle, label: 'Triangle Node' },
    { id: 'diamond', icon: Diamond, label: 'Diamond Node' },
    { id: 'hexagon', icon: Hexagon, label: 'Hexagon Node' },
    { id: 'star', icon: Star, label: 'Star Node' },
  ];

  const tools = [
    { id: 'text', icon: Type, label: 'Text Node' },
    { id: 'image', icon: Image, label: 'Image Node' },
    { id: 'sticker', icon: Sticker, label: 'Sticker Node' },
    { id: 'custom', icon: Palette, label: 'Custom Node' },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, shape: string, label: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onShapeSelect(shape, label);
    }
  };

  return (
    <div 
      className="p-4 border-t bg-background flex items-center justify-between"
      role="toolbar"
      aria-label="Shape selection toolbar"
    >
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          {shapes.map(({ id, icon: Icon, label }) => (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => onShapeSelect(id, label)}
                  onKeyDown={(e) => handleKeyDown(e, id, label)}
                  className="h-9 w-9 focus:ring-2 focus:ring-ring"
                  aria-label={`Add ${label}`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add {label}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center space-x-1">
          {tools.map(({ id, icon: Icon, label }) => (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => onShapeSelect(id, label)}
                  onKeyDown={(e) => handleKeyDown(e, id, label)}
                  className="h-9 w-9 focus:ring-2 focus:ring-ring"
                  aria-label={`Add ${label}`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add {label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};