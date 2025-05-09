
import React from 'react';
import { Document, Page } from 'react-pdf';
import { ErrorDisplay } from '../../ErrorDisplay';

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
  const LoadingComponent = () => (
    <div className="flex items-center justify-center h-[500px]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>
  );

  const ErrorComponent = () => (
    <ErrorDisplay 
      title="PDF Error" 
      description="There was a problem loading this PDF. The file may be corrupted or password protected." 
    />
  );

  return (
    <div className="flex-1 overflow-auto pdf-container" id="document-viewer-content">
      <Document
        file={pdfUrl}
        onLoadSuccess={onLoadSuccess}
        loading={<LoadingComponent />}
        error={<ErrorComponent />}
        externalLinkTarget="_blank"
      >
        <div className="pdf-page-container" style={{ transform: `scale(${scale})` }}>
          <Page
            pageNumber={pageNumber}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            loading={<LoadingComponent />}
          />
          {children}
        </div>
      </Document>
    </div>
  );
};
