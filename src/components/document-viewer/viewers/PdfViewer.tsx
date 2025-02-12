
import React from 'react';
import { PdfViewer as PdfViewerComponent } from './pdf/PdfViewer';

interface PdfViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const PdfViewer: React.FC<PdfViewerProps> = (props) => {
  return <PdfViewerComponent {...props} />;
};
