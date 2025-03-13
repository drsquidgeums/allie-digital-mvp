
import React from 'react';
import { PSPDFKitViewer } from './PSPDFKitViewer';

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
      <PSPDFKitViewer
        file={file}
        url={url}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
      />
    </div>
  );
};
