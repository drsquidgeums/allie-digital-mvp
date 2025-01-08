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
              <Button variant="outline" size="icon" onClick={() => onShapeSelect('circle')} className="h-9 w-9">
                <CircleDot className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Circle Node</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => onShapeSelect('square')} className="h-9 w-9">
                <Square className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Square Node</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => onShapeSelect('triangle')} className="h-9 w-9">
                <Triangle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Triangle Node</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => onShapeSelect('diamond')} className="h-9 w-9">
                <Diamond className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Diamond Node</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => onShapeSelect('hexagon')} className="h-9 w-9">
                <Hexagon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Hexagon Node</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => onShapeSelect('star')} className="h-9 w-9">
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
              <Button variant="outline" size="icon" onClick={() => onShapeSelect('text')} className="h-9 w-9">
                <Type className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Text Node</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => onShapeSelect('image')} className="h-9 w-9">
                <Image className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Image Node</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => onShapeSelect('sticker')} className="h-9 w-9">
                <Sticker className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Sticker Node</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => onShapeSelect('custom')} className="h-9 w-9">
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