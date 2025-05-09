
import React from 'react';
import { Document, Page } from 'react-pdf';

interface PdfDocumentViewerProps {
  pdfUrl: string;
  pageNumber: number;
  scale: number;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
  children?: React.ReactNode;
}

export const PdfDocumentViewer: React.FC<PdfDocumentViewerProps> = ({
  pdfUrl,
  pageNumber,
  scale,
  onLoadSuccess,
  children
}) => {
  if (!pdfUrl) return null;
  
  return (
    <div 
      className="flex-1 overflow-auto flex justify-center bg-zinc-800"
      style={{ 
        transformOrigin: 'center top'
      }}
    >
      <div className="pdf-container relative" style={{ transform: `scale(${scale})` }}>
        <Document
          file={pdfUrl}
          onLoadSuccess={onLoadSuccess}
          loading={<div className="loading">Loading document...</div>}
          error={<div className="error">Failed to load document</div>}
        >
          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
          
          {/* Child components (like highlight overlays) will be rendered here */}
          {children}
        </Document>
      </div>
    </div>
  );
};
