import React from 'react';
import { Network } from "lucide-react";
import { ColorOption } from './types';
import { ColorSelector } from './toolbar/ColorSelector';
import { NodeInput } from './toolbar/NodeInput';
import { ExportButtons } from './toolbar/ExportButtons';

interface MindMapToolbarProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  newNodeText: string;
  setNewNodeText: (text: string) => void;
  onAddNode: () => void;
  onExportJpg: () => void;
  onExportJson: () => void;
  onClear: () => void;
  colorOptions: ColorOption[];
}

export const MindMapToolbar = ({
  selectedColor,
  setSelectedColor,
  customColor,
  setCustomColor,
  newNodeText,
  setNewNodeText,
  onAddNode,
  onExportJpg,
  onExportJson,
  onClear,
  colorOptions,
}: MindMapToolbarProps) => {
  return (
    <div 
      className="p-4 border-b flex items-center justify-between bg-background"
      role="toolbar"
      aria-label="Mind map toolbar"
    >
      <div className="flex items-center gap-2">
        <Network className="w-4 h-4 text-foreground" aria-hidden="true" />
        <h3 className="font-medium text-foreground">Mind Map</h3>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 mr-4">
          <ColorSelector
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            customColor={customColor}
            setCustomColor={setCustomColor}
            colorOptions={colorOptions}
          />
        </div>
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
  );
};