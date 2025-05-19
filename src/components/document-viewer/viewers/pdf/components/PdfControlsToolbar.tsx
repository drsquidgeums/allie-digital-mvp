
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize,
  RotateCw,
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
  rotateDocument?: () => void; // Added rotateDocument as an optional prop
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
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm">
          {pageNumber} / {numPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => changePage(1)}
          disabled={pageNumber >= numPages}
          className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
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
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <span className="text-sm">{Math.round(scale * 100)}%</span>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => zoom(0.1)}
          className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fitToScreen}
          title="Fit to screen"
          className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
        >
          <Maximize className="h-4 w-4" />
        </Button>
        
        {rotateDocument && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={rotateDocument}
            title="Rotate document"
            className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        )}
        
        {isHighlighter && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleHighlightMode}
            className={`dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300 ${isHighlightMode ? 'ring-2 ring-primary' : ''}`}
            style={{ backgroundColor: isHighlightMode ? selectedColor : undefined }}
          >
            <Highlighter className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
