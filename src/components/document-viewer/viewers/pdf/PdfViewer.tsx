
import React from 'react';
import { PdfJsExpressViewer } from './components/PdfJsExpressViewer';
import { PdfFooter } from './components/PdfFooter';

interface PdfViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = true
}) => {
  console.log("Rendering PDF with URL:", url || "from file");
  
  return (
    <div className="h-full flex flex-col">
      <PdfJsExpressViewer
        file={file}
        url={url}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
      />
      
      <PdfFooter isHighlighter={isHighlighter} />
    </div>
  );
};
