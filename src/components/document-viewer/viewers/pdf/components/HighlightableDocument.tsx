
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useToast } from '@/hooks/use-toast';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface HighlightableDocumentProps {
  file: {
    data?: File;
    url?: string;
  };
  selectedColor: string;
  isHighlighter?: boolean;
  onLoadSuccess?: (data: { numPages: number }) => void;
  onLoadError?: (error: Error) => void;
}

export const HighlightableDocument: React.FC<HighlightableDocumentProps> = ({
  file,
  selectedColor,
  isHighlighter = true,
  onLoadSuccess,
  onLoadError
}) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const { toast } = useToast();

  // Handle document load success
  const handleDocumentLoadSuccess = (document: { numPages: number }) => {
    setNumPages(document.numPages);
    setPageNumber(1);
    
    // Call the parent callback if provided
    if (onLoadSuccess) {
      onLoadSuccess(document);
    }
  };

  // Handle document load error
  const handleDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF document:', error);
    
    // Call the parent callback if provided
    if (onLoadError) {
      onLoadError(error);
    }
  };

  return (
    <div className="pdf-document-container overflow-auto h-full flex flex-col items-center">
      <Document
        file={file}
        onLoadSuccess={handleDocumentLoadSuccess}
        onLoadError={handleDocumentLoadError}
        loading={
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }
        className="pdf-document"
      >
        {Array.from(new Array(numPages), (_, index) => (
          <div key={`page_${index + 1}`} className="pdf-page-container mb-4 relative">
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={scale}
              className="pdf-page shadow-md"
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </div>
        ))}
      </Document>
    </div>
  );
};

export default HighlightableDocument;
