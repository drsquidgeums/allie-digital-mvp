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
    { id: 'circle', icon: CircleDot, label: 'Circle Node', description: 'Add a circular node' },
    { id: 'square', icon: Square, label: 'Square Node', description: 'Add a square node' },
    { id: 'triangle', icon: Triangle, label: 'Triangle Node', description: 'Add a triangular node' },
    { id: 'diamond', icon: Diamond, label: 'Diamond Node', description: 'Add a diamond node' },
    { id: 'hexagon', icon: Hexagon, label: 'Hexagon Node', description: 'Add a hexagonal node' },
    { id: 'star', icon: Star, label: 'Star Node', description: 'Add a star node' },
  ];

  const tools = [
    { id: 'text', icon: Type, label: 'Text Node', description: 'Add a text node' },
    { id: 'image', icon: Image, label: 'Image Node', description: 'Add an image node' },
    { id: 'sticker', icon: Sticker, label: 'Sticker Node', description: 'Add a sticker node' },
    { id: 'custom', icon: Palette, label: 'Custom Node', description: 'Add a custom node' },
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
          {shapes.map(({ id, icon: Icon, label, description }) => (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => onShapeSelect(id, label)}
                  onKeyDown={(e) => handleKeyDown(e, id, label)}
                  className="h-9 w-9 focus:ring-2 focus:ring-ring"
                  aria-label={description}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{description}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center space-x-1">
          {tools.map(({ id, icon: Icon, label, description }) => (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => onShapeSelect(id, label)}
                  onKeyDown={(e) => handleKeyDown(e, id, label)}
                  className="h-9 w-9 focus:ring-2 focus:ring-ring"
                  aria-label={description}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{description}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};