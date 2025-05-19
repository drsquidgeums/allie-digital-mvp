
import React from 'react';
import { Document, Page } from 'react-pdf';
import { HighlightLayer } from './HighlightLayer';

interface PdfDocumentProps {
  file: string;
  pageNumber: number;
  zoom: number;
  highlights: any[];
  selectedHighlightId: string | null;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onHighlightClick: (id: string) => void;
}

export const PdfDocument: React.FC<PdfDocumentProps> = ({
  file,
  pageNumber,
  zoom,
  highlights,
  selectedHighlightId,
  onLoadSuccess,
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
          options={{
            cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/',
            cMapPacked: true,
            standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/standard_fonts/',
          }}
          loading={
            <div 
              className="loading-indicator"
              role="status"
              aria-live="polite"
            >
              Loading PDF...
            </div>
          }
          error={
            <div 
              className="error-message"
              role="alert"
            >
              Failed to load PDF
            </div>
          }
          inputRef={(ref) => {
            if (ref) {
              ref.setAttribute('aria-label', 'PDF Document');
            }
          }}
          className="pdf-document"
        >
          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="pdf-page"
            inputRef={(ref) => {
              if (ref) {
                ref.setAttribute('aria-label', `Page ${pageNumber}`);
              }
            }}
            canvasBackground="transparent"
            renderMode="canvas"
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
