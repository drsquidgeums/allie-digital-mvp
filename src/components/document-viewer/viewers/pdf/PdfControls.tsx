import React from 'react';
import { Button } from '@/components/ui/button';

interface PdfControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onHighlight?: () => void;
  isHighlighter?: boolean;
  selectedColor?: string;
}

export const PdfControls: React.FC<PdfControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onHighlight,
  isHighlighter,
  selectedColor
}) => {
  return (
    <div className="flex justify-between p-4 border-b">
      <div className="flex gap-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1 bg-primary text-primary-foreground rounded disabled:opacity-50"
        >
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages || 1}</span>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 bg-primary text-primary-foreground rounded disabled:opacity-50"
        >
          Next
        </Button>
      </div>
      {isHighlighter && onHighlight && (
        <Button
          onClick={onHighlight}
          className="px-3 py-1 rounded"
          style={{ backgroundColor: selectedColor, color: 'white' }}
        >
          Highlight Selection
        </Button>
      )}
    </div>
  );
};