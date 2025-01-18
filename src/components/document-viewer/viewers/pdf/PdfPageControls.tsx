import React from 'react';
import { Button } from "@/components/ui/button";

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
      <Button
        variant="outline"
        onClick={() => onPageChange(-1)}
        disabled={currentPage <= 1}
      >
        Previous
      </Button>
      <span className="px-4 py-2">
        Page {currentPage} of {numPages}
      </span>
      <Button
        variant="outline"
        onClick={() => onPageChange(1)}
        disabled={currentPage >= numPages}
      >
        Next
      </Button>
    </div>
  );
};