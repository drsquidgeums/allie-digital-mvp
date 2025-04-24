
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
  Keyboard
} from 'lucide-react';

interface PdfToolbarProps {
  pageNumber: number;
  numPages: number;
  zoom: number;
  onPageChange: (offset: number) => void;
  onZoomChange: (delta: number) => void;
  onKeyboardHelp?: () => void;
}

export const PdfToolbar: React.FC<PdfToolbarProps> = ({
  pageNumber,
  numPages,
  zoom,
  onPageChange,
  onZoomChange,
  onKeyboardHelp
}) => {
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
                className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
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
                onClick={() => onPageChange(1)}
                disabled={pageNumber >= numPages}
                aria-label="Next page"
                className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
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
                onClick={() => onZoomChange(-0.1)}
                aria-label="Zoom out"
                className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
              >
                <ZoomOut className="h-4 w-4 dark:text-white text-black" />
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
                className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
              >
                <ZoomIn className="h-4 w-4 dark:text-white text-black" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom in (Ctrl + +)</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onKeyboardHelp}
                aria-label="Keyboard shortcuts"
                className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
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
