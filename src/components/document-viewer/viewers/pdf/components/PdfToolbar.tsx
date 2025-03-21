
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Highlighter
} from 'lucide-react';

interface PdfToolbarProps {
  pageNumber: number;
  numPages: number;
  zoom: number;
  isTextSelected: boolean;
  selectedColor: string;
  isHighlighter: boolean;
  onPageChange: (offset: number) => void;
  onZoomChange: (delta: number) => void;
  onHighlight: () => void;
}

export const PdfToolbar: React.FC<PdfToolbarProps> = ({
  pageNumber,
  numPages,
  zoom,
  isTextSelected,
  selectedColor,
  isHighlighter,
  onPageChange,
  onZoomChange,
  onHighlight
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
        
        {isHighlighter && (
          <Button
            variant="outline"
            size="sm"
            style={{
              backgroundColor: isTextSelected ? selectedColor : 'transparent',
              color: isTextSelected ? getContrastColor(selectedColor) : 'currentColor'
            }}
            onClick={onHighlight}
          >
            <Highlighter className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
