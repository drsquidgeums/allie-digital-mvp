
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  Image, 
  Trash2, 
  FileDown
} from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { HistoryControls } from './toolbar/HistoryControls';
import { LayoutControls } from './toolbar/LayoutControls';
import { TemplateSelector } from './toolbar/TemplateSelector';
import { LayoutType } from './hooks/useAutoLayout';
import { MindMapNode } from './types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MindMapToolbarProps {
  newNodeText: string;
  setNewNodeText: (text: string) => void;
  onAddNode: () => void;
  onExportJpg: () => void;
  onExportJson: () => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onApplyLayout: (layoutType: LayoutType) => void;
  onLoadTemplate: (templateNodes: Omit<MindMapNode, 'id'>[]) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
}

export const MindMapToolbar: React.FC<MindMapToolbarProps> = ({ 
  newNodeText,
  setNewNodeText,
  onAddNode,
  onExportJpg,
  onExportJson,
  onClear,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onApplyLayout,
  onLoadTemplate,
  onZoomIn,
  onZoomOut,
  onFitView,
}) => {
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

  const exportToPDF = async () => {
    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import('jspdf');
      const element = document.querySelector('.react-flow') as HTMLElement;
      
      if (!element) {
        toast("Could not find the mind map element");
        return;
      }

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [element.offsetWidth, element.offsetHeight]
      });

      // Convert to canvas first
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(element, {
        backgroundColor: '#ffffff',
        width: element.offsetWidth,
        height: element.offsetHeight,
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, element.offsetWidth, element.offsetHeight);
      pdf.save('mindmap.pdf');
      toast("Mind map exported as PDF");
    } catch (error) {
      console.error('PDF export error:', error);
      toast("Failed to export as PDF");
    }
  };

  return (
    <div 
      className="p-3 border-b border-border/30 bg-background/95 backdrop-blur-sm flex flex-wrap items-center gap-3"
      aria-label="Mind map toolbar"
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Add a node..."
          value={newNodeText}
          onChange={(e) => setNewNodeText(e.target.value)}
          className="min-w-[200px] h-9"
        />
        <Button type="submit" size="sm" className="h-9">Add</Button>
      </form>
      
      <Separator orientation="vertical" className="h-6" />
      
      <HistoryControls
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      
      <Separator orientation="vertical" className="h-6" />
      
      <TemplateSelector onLoadTemplate={onLoadTemplate} />
      
      <Separator orientation="vertical" className="h-6" />
      
      <LayoutControls
        onApplyLayout={onApplyLayout}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onFitView={onFitView}
      />
      
      <div className="flex items-center gap-2 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 px-3">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExportJpg}>
              <Image className="h-4 w-4 mr-2" />
              Export as JPG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportToPDF}>
              <FileDown className="h-4 w-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportJson}>
              <FileDown className="h-4 w-4 mr-2" />
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClear}
              className="text-destructive hover:bg-destructive/10 h-9 px-3"
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
