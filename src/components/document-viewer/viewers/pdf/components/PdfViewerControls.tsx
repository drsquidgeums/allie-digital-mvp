
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Trash2 } from 'lucide-react';
import { getContrastColor } from '../utils/colorUtils';

interface PdfViewerControlsProps {
  pageNumber: number;
  numPages: number;
  scale: number;
  selectedHighlightId: string | null;
  selectedColor: string;
  onChangePage: (offset: number) => void;
  onZoom: (factor: number) => void;
  onTextSelect: () => void;
  onDeleteHighlight: (id: string) => void;
}

export const PdfViewerControls: React.FC<PdfViewerControlsProps> = ({
  pageNumber,
  numPages,
  scale,
  selectedHighlightId,
  selectedColor,
  onChangePage,
  onZoom,
  onTextSelect,
  onDeleteHighlight
}) => {
  return (
    <div className="flex items-center justify-between p-2 bg-zinc-800 text-white border-b">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChangePage(-1)}
          disabled={pageNumber <= 1}
          className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
        >
          <ChevronLeft className="h-4 w-4 dark:text-white text-black" />
        </Button>
        
        <span className="text-sm">
          {pageNumber} / {numPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChangePage(1)}
          disabled={pageNumber >= numPages}
          className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
        >
          <ChevronRight className="h-4 w-4 dark:text-white text-black" />
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onZoom(-0.1)}
          className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
        >
          <ZoomOut className="h-4 w-4 dark:text-white text-black" />
        </Button>
        
        <span className="text-sm">{Math.round(scale * 100)}%</span>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onZoom(0.1)}
          className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
        >
          <ZoomIn className="h-4 w-4 dark:text-white text-black" />
        </Button>
        
        {selectedHighlightId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => selectedHighlightId && onDeleteHighlight(selectedHighlightId)}
            className="dark:bg-zinc-700 dark:text-white bg-white text-black border-gray-300"
          >
            <Trash2 className="h-4 w-4 dark:text-white text-black" />
          </Button>
        )}
      </div>
    </div>
  );
};
