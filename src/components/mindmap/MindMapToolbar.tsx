
import React from 'react';
import { Network } from "lucide-react";
import { ColorSelector } from './toolbar/ColorSelector';
import { NodeInput } from './toolbar/NodeInput';
import { ExportButtons } from './toolbar/ExportButtons';
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";

interface MindMapToolbarProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  selectedTextColor: string;
  setSelectedTextColor: (color: string) => void;
  customTextColor: string;
  setCustomTextColor: (color: string) => void;
  newNodeText: string;
  setNewNodeText: (text: string) => void;
  onAddNode: () => void;
  onExportJpg: () => void;
  onExportJson: () => void;
  onClear: () => void;
  colorOptions: any[];
  textColorOptions: any[];
}

export const MindMapToolbar = ({
  selectedColor,
  setSelectedColor,
  customColor,
  setCustomColor,
  selectedTextColor,
  setSelectedTextColor,
  customTextColor,
  setCustomTextColor,
  newNodeText,
  setNewNodeText,
  onAddNode,
  onExportJpg,
  onExportJson,
  onClear,
  colorOptions,
  textColorOptions,
}: MindMapToolbarProps) => {
  return (
    <TooltipProvider>
      <div 
        className="p-3 border-b border-border/30 flex items-center justify-between bg-background shadow-sm z-10"
        role="toolbar"
        aria-label="Mind map toolbar"
      >
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-primary" aria-hidden="true" />
          <h3 className="font-medium text-foreground">Mind Map</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <ColorSelector
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              customColor={customColor}
              setCustomColor={setCustomColor}
              colorOptions={colorOptions}
              label="Node color"
            />
            <ColorSelector
              selectedColor={selectedTextColor}
              setSelectedColor={setSelectedTextColor}
              customColor={customTextColor}
              setCustomColor={setCustomTextColor}
              colorOptions={textColorOptions}
              label="Text color"
            />
          </div>
          <Separator orientation="vertical" className="h-8" />
          <NodeInput
            newNodeText={newNodeText}
            setNewNodeText={setNewNodeText}
            onAddNode={onAddNode}
          />
          <ExportButtons
            onExportJpg={onExportJpg}
            onExportJson={onExportJson}
            onClear={onClear}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};
