
import React from 'react';

interface PDFTronViewerContainerProps {
  url?: string;
  file?: File;
  selectedColor: string;
  isHighlighter: boolean;
  onContentLoaded?: (content: string, fileName: string) => void;
}

// This is a legacy component that's being replaced by SimplePdfViewer
const PDFTronViewerContainer: React.FC<PDFTronViewerContainerProps> = ({
  url,
  file,
  selectedColor,
  isHighlighter,
  onContentLoaded
}) => {
  // This component is now just a pass-through to SimplePdfViewer
  // See SimplePdfViewer.tsx for the actual implementation
  return null;
};

export default PDFTronViewerContainer;
