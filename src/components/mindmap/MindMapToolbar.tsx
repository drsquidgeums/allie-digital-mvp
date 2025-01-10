import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Network, Download, Plus, Trash2 } from "lucide-react";
import { ColorOption } from './types';
import { ColorPicker } from '../ColorPicker';

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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddNode();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setNewNodeText('');
      (e.target as HTMLElement).blur();
    }
  };

  const handleColorKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const select = e.target as HTMLSelectElement;
      setSelectedColor(select.value);
    }
  };

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
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            onKeyDown={handleColorKeyDown}
            className="h-9 px-3 py-1 rounded-md border border-input bg-background text-foreground text-sm pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Select node color"
          >
            {colorOptions.map((color) => (
              <option key={color.value} value={color.value}>
                {color.label}
              </option>
            ))}
          </select>
          {selectedColor === 'custom' && (
            <ColorPicker
              label="Custom color"
              value={customColor}
              onChange={setCustomColor}
            />
          )}
        </div>
        <Input
          value={newNodeText}
          onChange={(e) => setNewNodeText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a node..."
          className="w-64 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="New node text"
        />
        <Button 
          onClick={onAddNode} 
          size="icon" 
          variant="outline" 
          className="bg-background hover:bg-accent focus:ring-2 focus:ring-ring"
          aria-label="Add node"
        >
          <Plus className="w-4 h-4 text-foreground" aria-hidden="true" />
        </Button>
        <Button 
          onClick={onExportJpg} 
          variant="outline" 
          size="icon" 
          className="bg-background hover:bg-accent focus:ring-2 focus:ring-ring"
          aria-label="Export as JPG"
        >
          <Download className="w-4 h-4 text-foreground" aria-hidden="true" />
        </Button>
        <Button 
          onClick={onExportJson} 
          variant="outline" 
          size="icon" 
          className="bg-background hover:bg-accent focus:ring-2 focus:ring-ring"
          aria-label="Export as JSON"
        >
          <span className="text-[10px] font-medium">JSON</span>
        </Button>
        <Button 
          onClick={onClear} 
          variant="outline" 
          size="icon" 
          className="bg-background hover:bg-accent focus:ring-2 focus:ring-ring"
          aria-label="Clear canvas"
        >
          <Trash2 className="w-4 h-4 text-foreground" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};