
import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { HighlightLayer } from './HighlightLayer';

// Configure PDF.js worker globally
if (!pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

interface PdfDocumentProps {
  file: string;
  pageNumber: number;
  zoom: number;
  highlights: any[];
  selectedHighlightId: string | null;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
  onLoadingStart?: () => void;
  onHighlightClick: (id: string) => void;
}

export const PdfDocument: React.FC<PdfDocumentProps> = ({
  file,
  pageNumber,
  zoom,
  highlights,
  selectedHighlightId,
  onLoadSuccess,
  onLoadError,
  onLoadingStart,
  onHighlightClick
}) => {
  // Get the current page's highlights
  const pageHighlights = highlights.filter(h => h.position.pageNumber === pageNumber);
  
  return (
    <div 
      className="flex-1 overflow-auto bg-zinc-800 flex justify-center"
      tabIndex={0}
      aria-label={`PDF document, page ${pageNumber}`}
    >
      <div 
        style={{ 
          transform: `scale(${zoom})`, 
          transformOrigin: 'center top',
          position: 'relative'
        }}
        className="pdf-container"
      >
        <Document
          file={file}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          onItemClick={onLoadingStart}
          options={{
            isEvalSupported: false,
            standardFontDataUrl: `https://unpkg.com/pdfjs-dist@4.10.38/standard_fonts/`,
            cMapUrl: `https://unpkg.com/pdfjs-dist@4.10.38/cmaps/`,
            cMapPacked: true,
          }}
          loading={
            <div 
              className="loading-indicator flex items-center justify-center p-8"
              role="status"
              aria-live="polite"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-2"></div>
              Loading PDF...
            </div>
          }
          error={
            <div 
              className="error-message text-center p-8"
              role="alert"
            >
              <p className="text-destructive">Failed to load PDF</p>
              <p className="text-sm text-muted-foreground mt-2">Please try a different file or check your internet connection.</p>
            </div>
          }
          className="pdf-document"
        >
          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={true}
            renderAnnotationLayer={false}
            className="pdf-page"
            canvasBackground="transparent"
            scale={1} // Let the container handle scaling
          />

          {/* Render highlights only when they exist */}
          {pageHighlights.length > 0 && (
            <HighlightLayer 
              highlights={pageHighlights}
              selectedHighlightId={selectedHighlightId}
              onHighlightClick={onHighlightClick}
            />
          )}
        </Document>
      </div>
    </div>
  );
};
