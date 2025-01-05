import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PdfViewerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentPage: number;
  totalPages: number;
  onPageChange: (direction: 'prev' | 'next') => void;
}

export const PdfViewer = ({ 
  canvasRef, 
  currentPage, 
  totalPages, 
  onPageChange 
}: PdfViewerProps) => {
  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full" />
      {totalPages > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-background/80 p-2 rounded-lg shadow">
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
    </div>
  );
};