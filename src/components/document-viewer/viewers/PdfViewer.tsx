
import React, { useState } from 'react';
import { SimplePdfViewer } from './pdf/components/SimplePdfViewer';

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
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(0);
  
  const handleContentLoaded = (content: string, fileName: string) => {
    console.log(`PDF loaded: ${fileName}`);
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SimplePdfViewer
        url={url}
        file={file}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
        onContentLoaded={handleContentLoaded}
      />
    </div>
  );
};
