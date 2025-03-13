
import React from 'react';
import { PDFTronViewer } from './PDFTronViewer';

interface CustomPDFViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const CustomPDFViewer: React.FC<CustomPDFViewerProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = true
}) => {
  return (
    <div className="h-full flex flex-col">
      <PDFTronViewer
        file={file}
        url={url}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
      />
    </div>
  );
};

export default CustomPDFViewer;
