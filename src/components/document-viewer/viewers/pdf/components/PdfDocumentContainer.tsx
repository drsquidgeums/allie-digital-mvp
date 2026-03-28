
import React from 'react';
import { Document, Page } from 'react-pdf';

interface PdfDocumentContainerProps {
  file: File | string | null;
  pageNumber: number;
  scale: number;
  rotation: number;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
  children?: React.ReactNode;
}

export const PdfDocumentContainer: React.FC<PdfDocumentContainerProps> = ({
  file,
  pageNumber,
  scale,
  rotation,
  onLoadSuccess,
  onLoadError,
  children
}) => {
  return (
    <div 
      className="flex-1 overflow-auto flex justify-center bg-muted/10 p-4 relative"
      id="pdf-content"
      tabIndex={0}
      aria-label={`PDF page ${pageNumber}`}
    >
      <Document
        file={file}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        options={{ isEvalSupported: false }}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" aria-label="Loading PDF"></div>
          </div>
        }
      >
        <div className="relative">
          <Page
            pageNumber={pageNumber}
            scale={scale}
            rotate={rotation}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg"
          />
          {children}
        </div>
      </Document>
    </div>
  );
};
