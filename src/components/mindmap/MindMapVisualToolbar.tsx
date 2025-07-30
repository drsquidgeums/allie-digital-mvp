
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { VisualExportButtons } from './toolbar/VisualExportButtons';
import { VisualTemplateSelector } from './toolbar/VisualTemplateSelector';
import { VisualLayoutControls } from './toolbar/VisualLayoutControls';
import { VisualHistoryControls } from './toolbar/VisualHistoryControls';
import { VisualColorSelector } from './toolbar/VisualColorSelector';

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutType } from './hooks/useAutoLayout';
import { MindMapNode } from './types';

interface MindMapVisualToolbarProps {
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
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  selectedTextColor: string;
  setSelectedTextColor: (color: string) => void;
  customTextColor: string;
  setCustomTextColor: (color: string) => void;
}

export const MindMapVisualToolbar: React.FC<MindMapVisualToolbarProps> = ({
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
  selectedColor,
  setSelectedColor,
  customColor,
  setCustomColor,
  selectedTextColor,
  setSelectedTextColor,
  customTextColor,
  setCustomTextColor,
}) => {
  const handleClear = () => {
    if (confirm("Clear the mind map? This cannot be undone.")) {
      onClear();
    }
  };

  const exportToPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const element = document.querySelector('.react-flow') as HTMLElement;
      
      if (!element) return;

      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(element, {
        backgroundColor: '#ffffff',
        width: element.offsetWidth,
        height: element.offsetHeight,
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [element.offsetWidth, element.offsetHeight]
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, element.offsetWidth, element.offsetHeight);
      pdf.save('mindmap.pdf');
    } catch (error) {
      console.error('PDF export error:', error);
    }
  };

  return (
    <div className="p-3 border-b border-border/30 bg-background/95 backdrop-blur-sm flex items-center justify-between min-w-0">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <VisualHistoryControls
          onUndo={onUndo}
          onRedo={onRedo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        
        <Separator orientation="vertical" className="h-6" />
        
        <VisualTemplateSelector onLoadTemplate={onLoadTemplate} />
        
        <Separator orientation="vertical" className="h-6" />
        
        <VisualLayoutControls
          onApplyLayout={onApplyLayout}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onFitView={onFitView}
        />
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <VisualColorSelector
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          customColor={customColor}
          setCustomColor={setCustomColor}
          selectedTextColor={selectedTextColor}
          setSelectedTextColor={setSelectedTextColor}
          customTextColor={customTextColor}
          setCustomTextColor={setCustomTextColor}
        />
        
        <Separator orientation="vertical" className="h-6" />
        
        <VisualExportButtons
          onExportJpg={onExportJpg}
          onExportJson={onExportJson}
          onExportPdf={exportToPDF}
        />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10 border-destructive/30"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear Mind Map</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
