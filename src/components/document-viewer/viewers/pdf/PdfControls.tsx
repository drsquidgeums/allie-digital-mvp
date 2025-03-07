
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Highlighter } from 'lucide-react';

interface PdfControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onHighlight: () => void;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const PdfControls: React.FC<PdfControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onHighlight,
  selectedColor,
  isHighlighter
}) => {
  return (
    <div className="flex justify-between items-center p-3 border-b bg-card">
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          variant="outline"
          size="sm"
          className="h-8 px-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <span className="text-sm mx-2">
          Page {currentPage} of {totalPages || 1}
        </span>
        
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          variant="outline"
          size="sm"
          className="h-8 px-2"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      {isHighlighter && (
        <Button
          onClick={onHighlight}
          variant="outline"
          size="sm"
          className="h-8 px-2 flex items-center gap-1"
          style={{ 
            backgroundColor: selectedColor || 'transparent',
            color: selectedColor ? 'white' : 'currentColor',
            borderColor: selectedColor || 'currentColor'
          }}
        >
          <Highlighter className="h-4 w-4 mr-1" />
          Highlight Selection
        </Button>
      )}
    </div>
  );
};
