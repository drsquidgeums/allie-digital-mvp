
import React from 'react';
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PdfToolbarProps {
  scale: number;
  rotation: number;
  currentPage: number;
  numPages: number;
  zoomIn: () => void;
  zoomOut: () => void;
  rotateClockwise: () => void;
  rotateCounterClockwise: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

export const PdfToolbar: React.FC<PdfToolbarProps> = ({
  scale,
  rotation,
  currentPage,
  numPages,
  zoomIn,
  zoomOut,
  rotateClockwise,
  rotateCounterClockwise,
  goToPreviousPage,
  goToNextPage
}) => {
  return (
    <div className="bg-muted/30 p-2 border-b flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={zoomOut} 
          disabled={scale <= 0.5}
          title="Zoom out"
        >
          <ZoomOut size={16} />
        </Button>
        <span className="text-xs">{Math.round(scale * 100)}%</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={zoomIn} 
          disabled={scale >= 3}
          title="Zoom in"
        >
          <ZoomIn size={16} />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={rotateCounterClockwise}
          title="Rotate counterclockwise"
        >
          <RotateCcw size={16} />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={rotateClockwise}
          title="Rotate clockwise"
        >
          <RotateCw size={16} />
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToPreviousPage} 
          disabled={currentPage <= 1}
          title="Previous page"
        >
          <ChevronLeft size={16} />
        </Button>
        <span className="text-xs">Page {currentPage} of {numPages || '?'}</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToNextPage} 
          disabled={currentPage >= numPages}
          title="Next page"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};
