
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { ShapeGroup } from './toolbar/ShapeGroup';
import { SHAPE_CONFIGS } from './constants/shapeConfigs';
import { TooltipProvider } from "@/components/ui/tooltip";

interface MindMapCreativeToolbarProps {
  onShapeSelect: (shape: string, label?: string) => void;
}

export const MindMapCreativeToolbar = ({
  onShapeSelect
}: MindMapCreativeToolbarProps) => {
  return (
    <TooltipProvider>
      <div 
        className="p-3 border-t border-border/30 bg-background/80 backdrop-blur-sm flex items-center justify-between shadow-md"
        role="toolbar"
        aria-label="Shape selection toolbar"
      >
        <div className="flex items-center space-x-4">
          <ShapeGroup shapes={SHAPE_CONFIGS.shapes} onShapeSelect={onShapeSelect} />
          <Separator orientation="vertical" className="h-8" />
          <ShapeGroup shapes={SHAPE_CONFIGS.tools} onShapeSelect={onShapeSelect} />
        </div>
      </div>
    </TooltipProvider>
  );
};
