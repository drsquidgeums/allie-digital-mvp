
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { ShapeGroup } from './toolbar/ShapeGroup';
import { SHAPE_CONFIGS } from './constants/shapeConfigs';
import { TooltipProvider } from "@/components/ui/tooltip";
import { ColorSelector } from './toolbar/ColorSelector';

interface MindMapCreativeToolbarProps {
  onShapeSelect: (shape: string, label?: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  selectedTextColor: string;
  setSelectedTextColor: (color: string) => void;
  customTextColor: string;
  setCustomTextColor: (color: string) => void;
}

export const MindMapCreativeToolbar = ({
  onShapeSelect,
  selectedColor,
  setSelectedColor,
  customColor,
  setCustomColor,
  selectedTextColor,
  setSelectedTextColor,
  customTextColor,
  setCustomTextColor
}: MindMapCreativeToolbarProps) => {
  return (
    <TooltipProvider delayDuration={300}>
      <div 
        className="p-3 border-t border-border/30 bg-background/95 backdrop-blur-sm flex items-center justify-between shadow-md"
        role="toolbar"
        aria-label="Shape selection toolbar"
        style={{ zIndex: 10 }} // Ensure proper z-index
      >
        <div className="flex items-center space-x-4">
          <ShapeGroup shapes={SHAPE_CONFIGS.shapes} onShapeSelect={onShapeSelect} />
          <Separator orientation="vertical" className="h-8" />
          <ShapeGroup shapes={SHAPE_CONFIGS.tools} onShapeSelect={onShapeSelect} />
          <Separator orientation="vertical" className="h-8" />
          <div className="flex items-center gap-3">
            <ColorSelector
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              customColor={customColor}
              setCustomColor={setCustomColor}
              colorOptions={[
                { value: 'hsl(var(--primary))', label: 'Primary' },
                { value: 'hsl(var(--secondary))', label: 'Secondary' },
                { value: 'hsl(var(--accent))', label: 'Accent' },
                { value: 'hsl(var(--muted))', label: 'Muted' },
                { value: 'custom', label: 'Custom' },
              ]}
              label="Shape color"
              type="shape"
            />
            <ColorSelector
              selectedColor={selectedTextColor}
              setSelectedTextColor={setSelectedTextColor}
              customColor={customTextColor}
              setCustomColor={setCustomTextColor}
              colorOptions={[
                { value: 'auto', label: 'Auto' },
                { value: 'hsl(var(--foreground))', label: 'Default' },
                { value: 'hsl(var(--primary))', label: 'Primary' },
                { value: 'hsl(var(--secondary))', label: 'Secondary' },
                { value: 'custom', label: 'Custom' },
              ]}
              label="Text color"
              type="text"
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
