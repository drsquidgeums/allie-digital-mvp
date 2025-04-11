
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PdfPaginationProps {
  currentPage: number;
  numPages: number;
  onPageChange: (newPage: number) => void;
}

export const PdfPagination: React.FC<PdfPaginationProps> = ({
  currentPage,
  numPages,
  onPageChange
}) => {
  return (
    <div className="flex justify-center p-2 border-t">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-1 mr-4 bg-gray-200 rounded-full disabled:opacity-50"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <span className="flex items-center text-sm">
        Page {currentPage} of {numPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= numPages}
        className="p-1 ml-4 bg-gray-200 rounded-full disabled:opacity-50"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};
