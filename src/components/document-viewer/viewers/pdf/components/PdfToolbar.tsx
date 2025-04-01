
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  TooltipProvider, 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent 
} from '@/components/ui/tooltip';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Highlighter,
  Keyboard
} from 'lucide-react';

interface PdfToolbarProps {
  pageNumber: number;
  numPages: number;
  zoom: number;
  isTextSelected: boolean;
  selectedColor: string;
  isHighlighter: boolean;
  isHighlightMode: boolean;
  onPageChange: (offset: number) => void;
  onZoomChange: (delta: number) => void;
  onHighlight: () => void;
  onKeyboardHelp?: () => void;
  onToggleHighlight: () => void;
}

export const PdfToolbar: React.FC<PdfToolbarProps> = ({
  pageNumber,
  numPages,
  zoom,
  isTextSelected,
  selectedColor,
  isHighlighter,
  isHighlightMode,
  onPageChange,
  onZoomChange,
  onHighlight,
  onKeyboardHelp,
  onToggleHighlight
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
      <div className="flex items-center justify-between p-2 bg-zinc-800 text-white border-b">
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(-1)}
                disabled={pageNumber <= 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
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
                onClick={() => onPageChange(1)}
                disabled={pageNumber >= numPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
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
                onClick={() => onZoomChange(-0.1)}
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom out (Ctrl + -)</TooltipContent>
          </Tooltip>
          
          <span className="text-sm" aria-live="polite">{Math.round(zoom * 100)}%</span>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onZoomChange(0.1)}
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom in (Ctrl + +)</TooltipContent>
          </Tooltip>
          
          {isHighlighter && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isHighlightMode ? "default" : "outline"}
                    size="sm"
                    onClick={onToggleHighlight}
                    aria-label="Toggle highlight mode"
                  >
                    <Highlighter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle highlight mode (H)</TooltipContent>
              </Tooltip>

              {isHighlightMode && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      style={{
                        backgroundColor: selectedColor,
                        color: getContrastColor(selectedColor)
                      }}
                      onClick={onHighlight}
                      aria-label="Highlight text"
                      disabled={!isTextSelected}
                    >
                      <Highlighter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Highlight selected text</TooltipContent>
                </Tooltip>
              )}
            </>
          )}
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onKeyboardHelp}
                aria-label="Keyboard shortcuts"
              >
                <Keyboard className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Keyboard shortcuts</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};
