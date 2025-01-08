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
  onShapeSelect: (shape: string) => void;
}

export const MindMapCreativeToolbar = ({
  onShapeSelect
}: MindMapCreativeToolbarProps) => {
  return (
    <div className="p-4 border-t bg-background flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => onShapeSelect('circle')}>
                <CircleDot className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Circle Node</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => onShapeSelect('square')}>
                <Square className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Square Node</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => onShapeSelect('triangle')}>
                <Triangle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Triangle Node</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => onShapeSelect('diamond')}>
                <Diamond className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Diamond Node</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => onShapeSelect('hexagon')}>
                <Hexagon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Hexagon Node</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => onShapeSelect('star')}>
                <Star className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Star Node</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => onShapeSelect('text')}>
                <Type className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Text Node</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => onShapeSelect('image')}>
                <Image className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Image Node</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => onShapeSelect('sticker')}>
                <Sticker className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Sticker Node</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => onShapeSelect('custom')}>
                <Palette className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Custom Node</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};