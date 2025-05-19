
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize,
  RotateCw,
  RotateCcw,
  Highlighter 
} from 'lucide-react';

interface PdfControlsToolbarProps {
  pageNumber: number;
  numPages: number;
  scale: number;
  isHighlightMode: boolean;
  isHighlighter: boolean;
  selectedColor: string;
  changePage: (offset: number) => void;
  zoom: (factor: number) => void;
  fitToScreen: () => void;
  rotateDocument?: () => void;
  rotateCounterClockwise?: () => void;
  toggleHighlightMode: () => void;
}

export const PdfToolbar: React.FC<PdfControlsToolbarProps> = ({
  pageNumber,
  numPages,
  scale,
  isHighlightMode,
  isHighlighter,
  selectedColor,
  changePage,
  zoom,
  fitToScreen,
  rotateDocument,
  rotateCounterClockwise,
  toggleHighlightMode
}) => {
  return (
    <div className="flex items-center justify-between p-2 bg-zinc-800 text-white border-b">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => changePage(-1)}
          disabled={pageNumber <= 1}
          className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm" aria-live="polite">
          {pageNumber} / {numPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => changePage(1)}
          disabled={pageNumber >= numPages}
          className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => zoom(-0.1)}
          className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
          aria-label="Zoom out"
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <span className="text-sm" aria-live="polite">
          {Math.round(scale * 100)}%
        </span>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => zoom(0.1)}
          className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
          aria-label="Zoom in"
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fitToScreen}
          title="Fit to screen"
          className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
          aria-label="Fit to screen"
        >
          <Maximize className="h-4 w-4" />
        </Button>
        
        {rotateDocument && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={rotateDocument}
            title="Rotate clockwise"
            className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
            aria-label="Rotate document clockwise"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        )}
        
        {rotateCounterClockwise && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={rotateCounterClockwise}
            title="Rotate counter-clockwise"
            className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
            aria-label="Rotate document counter-clockwise"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
        
        {isHighlighter && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleHighlightMode}
            className={`dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300 ${isHighlightMode ? 'ring-2 ring-primary' : ''}`}
            style={{ backgroundColor: isHighlightMode ? selectedColor : undefined }}
            aria-pressed={isHighlightMode}
            aria-label={`Toggle highlight mode ${isHighlightMode ? '(active)' : ''}`}
            title="Toggle highlight mode"
          >
            <Highlighter className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
