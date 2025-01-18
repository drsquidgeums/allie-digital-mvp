import React from 'react';

interface PdfPageControlsProps {
  currentPage: number;
  numPages: number;
  onPageChange: (offset: number) => void;
}

export const PdfPageControls: React.FC<PdfPageControlsProps> = ({
  currentPage,
  numPages,
  onPageChange,
}) => {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => onPageChange(-1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
      >
        Previous
      </button>
      <span className="px-4 py-2">
        Page {currentPage} of {numPages}
      </span>
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage >= numPages}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};