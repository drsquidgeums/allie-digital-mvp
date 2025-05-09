
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Trash2 } from 'lucide-react';

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
  onChangePage,
  onZoom,
  onTextSelect,
  onDeleteHighlight
}) => {
  return (
    <div className="pdf-toolbar">
      <div className="pdf-toolbar-group">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChangePage(-1)}
          disabled={pageNumber <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="pdf-page-info">
          <span className="pdf-page-number">{pageNumber}</span>
          <span className="pdf-page-label">of {numPages}</span>
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChangePage(1)}
          disabled={pageNumber >= numPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="pdf-toolbar-group">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onZoom(-0.1)}
          aria-label="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <span className="pdf-zoom-value">{Math.round(scale * 100)}%</span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onZoom(0.1)}
          aria-label="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="pdf-toolbar-group">
        <Button
          variant="ghost"
          size="sm"
          onClick={onTextSelect}
          aria-label="Highlight text"
        >
          Highlight Text
        </Button>
        
        {selectedHighlightId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteHighlight(selectedHighlightId)}
            className="text-destructive"
            aria-label="Delete highlight"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Highlight
          </Button>
        )}
      </div>
    </div>
  );
};
