
import React from 'react';

interface PdfFooterProps {
  isHighlighter: boolean;
}

export const PdfFooter: React.FC<PdfFooterProps> = ({ isHighlighter }) => {
  if (!isHighlighter) return null;
  
  return (
    <div className="text-xs text-muted-foreground p-2 border-t">
      To highlight an area, hold Alt key and drag. To highlight text, simply select it.
    </div>
  );
};
