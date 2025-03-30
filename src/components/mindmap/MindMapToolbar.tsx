
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  Image, 
  Trash2, 
  Layout, 
  Square, 
  Circle,
  Triangle
} from "lucide-react";
import { toast } from "sonner";
import { ColorSelector } from './toolbar/ColorSelector';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  textColorOptions
}) => {
  const [showExportOptions, setShowExportOptions] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNodeText.trim()) {
      onAddNode();
      toast(`Added text node: ${newNodeText}`);
    } else {
      toast("Please enter some text for the node");
    }
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear the mind map? This cannot be undone.")) {
      onClear();
      toast("Mind map cleared");
    }
  };

  return (
    <div 
      className="p-3 border-b border-border/30 bg-background/95 backdrop-blur-sm flex flex-wrap items-center gap-3"
      aria-label="Mind map toolbar"
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-1 min-w-[280px]">
        <Input
          type="text"
          placeholder="Add a node..."
          value={newNodeText}
          onChange={(e) => setNewNodeText(e.target.value)}
          className="min-w-[200px]"
        />
        <Button type="submit" size="sm">Add</Button>
      </form>
      
      <div className="flex items-center gap-2">
        <ColorSelector
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          customColor={customColor}
          setCustomColor={setCustomColor}
          colorOptions={colorOptions}
          label="Shape color"
          type="shape"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <ColorSelector
          selectedColor={selectedTextColor}
          setSelectedColor={setSelectedTextColor}
          customColor={customTextColor}
          setCustomColor={setCustomTextColor}
          colorOptions={textColorOptions}
          label="Text color"
          type="text"
        />
      </div>
      
      <div className="flex items-center gap-2 ml-auto">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowExportOptions(!showExportOptions)}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export your mind map</TooltipContent>
        </Tooltip>
        
        {showExportOptions && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onExportJpg}>
              <Image className="h-4 w-4 mr-1" />
              JPG
            </Button>
            <Button variant="ghost" size="sm" onClick={onExportJson}>
              <Layout className="h-4 w-4 mr-1" />
              JSON
            </Button>
          </div>
        )}
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClear}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear the mind map</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
