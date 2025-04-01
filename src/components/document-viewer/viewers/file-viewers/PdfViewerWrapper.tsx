
import React from 'react';
import { CustomPDFViewer } from '../../viewers/pdf/components/CustomPDFViewer';

interface PdfViewerWrapperProps {
  file: File | null;
  url: string;
  selectedColor?: string;
  isHighlighter?: boolean;
}

/**
 * PdfViewerWrapper Component
 * 
 * A wrapper for the PDF viewer component to handle props and configuration
 */
export const PdfViewerWrapper: React.FC<PdfViewerWrapperProps> = ({
  file,
  url,
  selectedColor = '#FFFF00',
  isHighlighter
}) => {
  return (
    <CustomPDFViewer 
      file={file} 
      url={url}
      selectedColor={selectedColor}
      isHighlighter={isHighlighter}
    />
  );
};

export default PdfViewerWrapper;
