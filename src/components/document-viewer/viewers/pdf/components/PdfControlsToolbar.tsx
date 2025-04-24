
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Highlighter,
  Keyboard
} from 'lucide-react';
import { 
  TooltipProvider, 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent 
} from '@/components/ui/tooltip';

interface PdfToolbarProps {
  pageNumber: number;
  numPages: number;
  scale: number;
  isHighlightMode: boolean;
  isHighlighter: boolean;
  selectedColor: string;
  changePage: (offset: number) => void;
  zoom: (delta: number) => void;
  rotateDocument: () => void;
  toggleHighlightMode: () => void;
}

export const PdfToolbar: React.FC<PdfToolbarProps> = ({
  pageNumber,
  numPages,
  scale,
  isHighlightMode,
  isHighlighter,
  selectedColor,
  changePage,
  zoom,
  rotateDocument,
  toggleHighlightMode
}) => {
  // Helper function to determine text color based on background color
  const getContrastColor = (hexColor: string): string => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between p-2 dark:bg-zinc-800 dark:text-white bg-white text-black border-b">
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(-1)}
                disabled={pageNumber <= 1}
                aria-label="Previous page"
                className="dark:text-white text-black"
              >
                <ChevronLeft className="h-4 w-4 dark:text-white text-black" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous page (Left Arrow)</TooltipContent>
          </Tooltip>
          
          <span className="text-sm" aria-live="polite">
            {pageNumber} / {numPages}
          </span>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(1)}
                disabled={pageNumber >= numPages}
                aria-label="Next page"
                className="dark:text-white text-black"
              >
                <ChevronRight className="h-4 w-4 dark:text-white text-black" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next page (Right Arrow)</TooltipContent>
          </Tooltip>
        </div>
        
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => zoom(-0.1)}
                aria-label="Zoom out"
                className="dark:text-white text-black"
              >
                <ZoomOut className="h-4 w-4 dark:text-white text-black" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom out (Ctrl + -)</TooltipContent>
          </Tooltip>
          
          <span className="text-sm" aria-live="polite">{Math.round(scale * 100)}%</span>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => zoom(0.1)}
                aria-label="Zoom in"
                className="dark:text-white text-black"
              >
                <ZoomIn className="h-4 w-4 dark:text-white text-black" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom in (Ctrl + +)</TooltipContent>
          </Tooltip>
          
          {isHighlighter && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  style={{
                    backgroundColor: isHighlightMode ? selectedColor : 'transparent',
                    color: isHighlightMode ? getContrastColor(selectedColor) : 'currentColor'
                  }}
                  onClick={toggleHighlightMode}
                  aria-label="Highlight text"
                  disabled={!isHighlightMode}
                  className="dark:text-white text-black"
                >
                  <Highlighter className="h-4 w-4 dark:text-white text-black" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Highlight selected text</TooltipContent>
            </Tooltip>
          )}
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={rotateDocument}
                aria-label="Keyboard shortcuts"
                className="dark:text-white text-black"
              >
                <Keyboard className="h-4 w-4 dark:text-white text-black" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Keyboard shortcuts</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};
