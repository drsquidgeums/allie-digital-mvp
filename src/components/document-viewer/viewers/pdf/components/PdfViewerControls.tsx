
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut,
  Maximize, 
  Highlighter, 
  Trash2 
} from 'lucide-react';

interface PdfViewerControlsProps {
  pageNumber: number;
  numPages: number;
  scale: number;
  selectedHighlightId: string | null;
  selectedColor: string;
  onChangePage: (offset: number) => void;
  onZoom: (factor: number) => void;
  onFitToScreen: () => void;
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
  onFitToScreen,
  onTextSelect,
  onDeleteHighlight
}) => {
  return (
    <div className="flex items-center justify-between p-2 bg-zinc-800 border-b">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChangePage(-1)}
          disabled={pageNumber <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm text-white">
          {pageNumber} / {numPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChangePage(1)}
          disabled={pageNumber >= numPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onZoom(-0.1)}
          aria-label="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <span className="text-sm text-white">{Math.round(scale * 100)}%</span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onZoom(0.1)}
          aria-label="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onFitToScreen}
          aria-label="Fit to screen"
        >
          <Maximize className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          style={{ backgroundColor: selectedColor }}
          onClick={onTextSelect}
          aria-label="Highlight text"
        >
          <Highlighter className="h-4 w-4" />
        </Button>
        
        {selectedHighlightId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteHighlight(selectedHighlightId)}
            aria-label="Delete highlight"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
