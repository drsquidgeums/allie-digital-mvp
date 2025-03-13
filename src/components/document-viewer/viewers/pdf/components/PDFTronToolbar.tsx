
import React from 'react';
import { 
  Highlighter, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw, 
  Hand, 
  MousePointer 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface PDFTronToolbarProps {
  instance: any;
  isHighlighter: boolean;
}

export const PDFTronToolbar: React.FC<PDFTronToolbarProps> = ({
  instance,
  isHighlighter
}) => {
  if (!instance) return null;
  
  const { Core, UI } = instance;
  
  // Handle zoom operations
  const handleZoomOut = () => {
    UI.setZoomLevel(UI.getZoomLevel() - 0.25);
  };
  
  const handleZoomIn = () => {
    UI.setZoomLevel(UI.getZoomLevel() + 0.25);
  };
  
  // Handle rotation
  const handleRotateCounterClockwise = () => {
    Core.documentViewer.rotateCounterClockwise();
  };
  
  const handleRotateClockwise = () => {
    Core.documentViewer.rotateClockwise();
  };
  
  // Handle tool selection
  const handlePanTool = () => {
    Core.documentViewer.setToolMode(Core.documentViewer.getTool('Pan'));
  };
  
  const handleTextSelectTool = () => {
    Core.documentViewer.setToolMode(Core.documentViewer.getTool('TextSelect'));
  };
  
  const handleHighlighterTool = () => {
    Core.documentViewer.setToolMode(Core.documentViewer.getTool('AnnotationCreateTextHighlight'));
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleZoomOut}
        title="Zoom out"
      >
        <ZoomOut size={16} />
      </Button>
      <span className="text-xs">{Math.round((UI.getZoomLevel() || 1) * 100)}%</span>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleZoomIn}
        title="Zoom in"
      >
        <ZoomIn size={16} />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleRotateCounterClockwise}
        title="Rotate counterclockwise"
      >
        <RotateCcw size={16} />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleRotateClockwise}
        title="Rotate clockwise"
      >
        <RotateCw size={16} />
      </Button>
      
      <Separator orientation="vertical" className="h-6" />
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handlePanTool}
        title="Pan tool"
      >
        <Hand size={16} />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleTextSelectTool}
        title="Text select tool"
      >
        <MousePointer size={16} />
      </Button>
      
      {isHighlighter && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleHighlighterTool}
          title="Highlighter tool"
        >
          <Highlighter size={16} />
        </Button>
      )}
    </div>
  );
};
