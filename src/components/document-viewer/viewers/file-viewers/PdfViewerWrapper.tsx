
import React from 'react';
import { SimplePdfHighlighter } from '../../viewers/pdf/SimplePdfHighlighter';
import { SimplePdfViewer } from '../../viewers/pdf/SimplePdfViewer';

interface PdfViewerWrapperProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
  onContentLoaded?: (content: string, fileName: string) => void;
}

export const PdfViewerWrapper: React.FC<PdfViewerWrapperProps> = ({ 
  file, 
  url, 
  selectedColor,
  isHighlighter = true,
  onContentLoaded
}) => {
  // Use either SimplePdfHighlighter or SimplePdfViewer based on isHighlighter flag
  if (isHighlighter) {
    return (
      <SimplePdfHighlighter
        file={file}
        url={url}
        selectedColor={selectedColor}
        isHighlighter={true}
      />
    );
  }

  return (
    <SimplePdfViewer
      file={file}
      url={url}
      selectedColor={selectedColor}
      isHighlighter={false}
      onContentLoaded={onContentLoaded}
    />
  );
};

export default PdfViewerWrapper;
