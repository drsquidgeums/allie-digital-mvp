
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Highlighter } from 'lucide-react';

interface PdfHighlightToolbarProps {
  pageNumber: number;
  numPages: number;
  zoom: number;
  isHighlighter: boolean;
  selectedColor: string;
  onPageChange: (offset: number) => void;
  onZoomChange: (delta: number) => void;
}

export const PdfHighlightToolbar: React.FC<PdfHighlightToolbarProps> = ({
  pageNumber,
  numPages,
  zoom,
  isHighlighter,
  selectedColor,
  onPageChange,
  onZoomChange
}) => {
  // Helper function to determine text color based on background luminance
  const getLuminance = (hexColor: string): number => {
    const r = parseInt(hexColor.slice(1, 3), 16) / 255;
    const g = parseInt(hexColor.slice(3, 5), 16) / 255;
    const b = parseInt(hexColor.slice(5, 7), 16) / 255;
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  return (
    <div className="flex items-center justify-between p-2 bg-zinc-800 text-white border-b">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(-1)}
          disabled={pageNumber <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm">
          {pageNumber} / {numPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={pageNumber >= numPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={() => onZoomChange(-0.1)}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <span className="text-sm">{Math.round(zoom * 100)}%</span>
        
        <Button variant="outline" size="sm" onClick={() => onZoomChange(0.1)}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          style={{
            backgroundColor: isHighlighter ? selectedColor : 'transparent',
            color: isHighlighter ? (getLuminance(selectedColor) > 0.5 ? '#000' : '#fff') : 'currentColor'
          }}
        >
          <Highlighter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
