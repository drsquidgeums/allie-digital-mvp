import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Highlighter } from 'lucide-react';

interface PdfControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (direction: 'prev' | 'next') => void;
  isHighlighting: boolean;
  onToggleHighlighting: () => void;
}

export const PdfControls: React.FC<PdfControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isHighlighting,
  onToggleHighlighting
}) => {
  return (
    <>
      <div className="flex justify-end mb-2 px-4">
        <Button
          variant={isHighlighting ? "secondary" : "outline"}
          size="sm"
          onClick={onToggleHighlighting}
          className="flex items-center gap-2"
        >
          <Highlighter className="h-4 w-4" />
          {isHighlighting ? "Disable" : "Enable"} Highlighter
        </Button>
      </div>
      {totalPages > 1 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-background/80 p-2 rounded-lg shadow z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange('prev')}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange('next')}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};