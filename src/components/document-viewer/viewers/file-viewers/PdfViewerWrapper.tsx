
import React from 'react';
import { PdfViewer } from '../PdfViewer';

interface PdfViewerWrapperProps {
  file: File | null;
  url: string;
  selectedColor?: string;
  isHighlighter?: boolean;
}

/**
 * PdfViewerWrapper Component
 * 
 * A wrapper for the PdfViewer component to handle props and configuration
 */
export const PdfViewerWrapper: React.FC<PdfViewerWrapperProps> = ({
  file,
  url,
  selectedColor = '#FFFF00',
  isHighlighter
}) => {
  return (
    <PdfViewer 
      file={file} 
      url={url} 
    />
  );
};

export default PdfViewerWrapper;
