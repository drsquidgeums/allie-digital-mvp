import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Network, Plus, Download, Trash2 } from "lucide-react";
import { ColorOption } from './types';

interface MindMapToolbarProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
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
        <Network className="w-4 h-4" />
        <h3 className="font-medium">Mind Map</h3>
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
        </div>
        <Input
          value={newNodeText}
          onChange={(e) => setNewNodeText(e.target.value)}
          placeholder="Add a node..."
          className="w-64 bg-background text-foreground"
          onKeyPress={(e) => e.key === "Enter" && onAddNode()}
        />
        <Button onClick={onAddNode} size="icon">
          <Plus className="w-4 h-4" />
        </Button>
        <Button onClick={onExport} variant="outline" size="icon">
          <Download className="w-4 h-4" />
        </Button>
        <Button onClick={onClear} variant="outline" size="icon">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};