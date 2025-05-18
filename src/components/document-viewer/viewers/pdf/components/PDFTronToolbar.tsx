
import React from 'react';
import { 
  Highlighter, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw,
  Maximize, 
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
  
  // Handle fit to screen
  const handleFitToScreen = () => {
    UI.setFitMode(instance.FitMode.FIT_PAGE);
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
        className="dark:hover:bg-zinc-700 hover:bg-gray-200"
      >
        <ZoomOut size={16} className="dark:text-white text-black" />
      </Button>
      <span className="text-xs dark:text-white text-black">{Math.round((UI.getZoomLevel() || 1) * 100)}%</span>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleZoomIn}
        title="Zoom in"
        className="dark:hover:bg-zinc-700 hover:bg-gray-200"
      >
        <ZoomIn size={16} className="dark:text-white text-black" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleFitToScreen}
        title="Fit to screen"
        className="dark:hover:bg-zinc-700 hover:bg-gray-200"
      >
        <Maximize size={16} className="dark:text-white text-black" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleRotateCounterClockwise}
        title="Rotate counterclockwise"
        className="dark:hover:bg-zinc-700 hover:bg-gray-200"
      >
        <RotateCcw size={16} className="dark:text-white text-black" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleRotateClockwise}
        title="Rotate clockwise"
        className="dark:hover:bg-zinc-700 hover:bg-gray-200"
      >
        <RotateCw size={16} className="dark:text-white text-black" />
      </Button>
      
      <Separator orientation="vertical" className="h-6" />
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handlePanTool}
        title="Pan tool"
        className="dark:hover:bg-zinc-700 hover:bg-gray-200"
      >
        <Hand size={16} className="dark:text-white text-black" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleTextSelectTool}
        title="Text select tool"
        className="dark:hover:bg-zinc-700 hover:bg-gray-200"
      >
        <MousePointer size={16} className="dark:text-white text-black" />
      </Button>
      
      {isHighlighter && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleHighlighterTool}
          title="Highlighter tool"
          className="dark:hover:bg-zinc-700 hover:bg-gray-200"
        >
          <Highlighter size={16} className="dark:text-white text-black" />
        </Button>
      )}
    </div>
  );
};
