
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Highlighter
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PdfControlsToolbarProps {
  pageNumber: number;
  numPages: number;
  scale: number;
  isHighlightMode: boolean;
  isHighlighter: boolean;
  changePage: (offset: number) => void;
  zoom: (factor: number) => void;
  rotateDocument: () => void;
  toggleHighlightMode: () => void;
}

export const PdfControlsToolbar: React.FC<PdfControlsToolbarProps> = ({
  pageNumber,
  numPages,
  scale,
  isHighlightMode,
  isHighlighter,
  changePage,
  zoom,
  rotateDocument,
  toggleHighlightMode
}) => {
  return (
    <div className="flex items-center justify-between p-2 bg-card border-b" role="toolbar" aria-label="PDF Controls">
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(-1)}
                disabled={pageNumber <= 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous page (Left arrow)</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <span className="text-sm" aria-live="polite" role="status">
          {pageNumber} / {numPages}
        </span>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(1)}
                disabled={pageNumber >= numPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next page (Right arrow)</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => zoom(-0.1)}
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom out (Ctrl+-)</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <span className="text-sm" aria-live="polite">
          {Math.round(scale * 100)}%
        </span>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => zoom(0.1)}
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom in (Ctrl++)</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={rotateDocument}
                aria-label="Rotate document"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rotate document (R)</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {isHighlighter && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={isHighlightMode ? "default" : "outline"} 
                  size="sm" 
                  onClick={toggleHighlightMode}
                  className={isHighlightMode ? "bg-primary" : ""}
                  aria-label="Toggle highlight mode"
                  aria-pressed={isHighlightMode}
                >
                  <Highlighter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle highlight mode (H)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};
