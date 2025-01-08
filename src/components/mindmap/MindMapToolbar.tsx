import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Network, Plus, Trash2 } from "lucide-react";
import { ColorOption } from './types';
import { ColorPicker } from '../ColorPicker';
import { downloadMindMap } from './utils/mindMapUtils';

interface MindMapToolbarProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  newNodeText: string;
  setNewNodeText: (text: string) => void;
  onAddNode: () => void;
  onExport: () => void;
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
  onExport,
  onClear,
  colorOptions,
}: MindMapToolbarProps) => {
  return (
    <div className="p-4 border-b flex items-center justify-between bg-background">
      <div className="flex items-center gap-2">
        <Network className="w-4 h-4 text-foreground" />
        <h3 className="font-medium text-foreground">Mind Map</h3>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 mr-4">
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="h-9 px-3 py-1 rounded-md border border-input bg-background text-foreground text-sm pr-8 appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem'
            }}
          >
            {colorOptions.map((color) => (
              <option key={color.value} value={color.value}>
                {color.label}
              </option>
            ))}
          </select>
          {selectedColor === 'custom' && (
            <ColorPicker
              label=""
              value={customColor}
              onChange={setCustomColor}
            />
          )}
        </div>
        <Input
          value={newNodeText}
          onChange={(e) => setNewNodeText(e.target.value)}
          placeholder="Add a node..."
          className="w-64 bg-background text-foreground"
          onKeyPress={(e) => e.key === "Enter" && onAddNode()}
        />
        <Button onClick={onAddNode} size="icon" variant="outline" className="bg-background hover:bg-accent">
          <Plus className="w-4 h-4 text-foreground" />
        </Button>
        <Button onClick={downloadMindMap} variant="outline" size="icon" className="bg-background hover:bg-accent">
          <Plus className="w-4 h-4 text-foreground" />
        </Button>
        <Button onClick={onExport} variant="outline" size="icon" className="bg-background hover:bg-accent">
          <span className="text-xs font-medium">JSON</span>
        </Button>
        <Button onClick={onClear} variant="outline" size="icon" className="bg-background hover:bg-accent">
          <Trash2 className="w-4 h-4 text-foreground" />
        </Button>
      </div>
    </div>
  );
};