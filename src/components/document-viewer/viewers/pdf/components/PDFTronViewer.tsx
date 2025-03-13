
import React from 'react';
import PDFTronViewerContainer from './PDFTronViewerContainer';

interface PDFTronViewerProps {
  url?: string;
  file?: File;
  selectedColor: string;
  isHighlighter: boolean;
  onContentLoaded?: (content: string, fileName: string) => void;
}

const PDFTronViewer: React.FC<PDFTronViewerProps> = ({
  url,
  file,
  selectedColor,
  isHighlighter,
  onContentLoaded
}) => {
  return (
    <div className="h-full">
      <PDFTronViewerContainer
        url={url}
        file={file}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
        onContentLoaded={onContentLoaded}
      />
    </div>
  );
};

export default PDFTronViewer;
