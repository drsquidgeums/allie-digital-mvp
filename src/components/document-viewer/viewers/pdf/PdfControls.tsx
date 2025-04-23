
import React from 'react';
import { Highlighter } from 'lucide-react';

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
    <div className="flex justify-between p-4 border-b">
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1 bg-primary text-primary-foreground rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages || 1}</span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 bg-primary text-primary-foreground rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {isHighlighter && (
        <button
          onClick={onHighlight}
          className="flex items-center gap-1 px-3 py-1 rounded"
          style={{ backgroundColor: selectedColor, color: 'white' }}
        >
          <Highlighter className="h-4 w-4" />
          <span>Highlight Selection</span>
        </button>
      )}
    </div>
  );
};
