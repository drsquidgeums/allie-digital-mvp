
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
      >
        <Document
          file={file}
          onLoadSuccess={onLoadSuccess}
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
          />

          {/* Render highlights for current page */}
          <HighlightLayer 
            highlights={highlights.filter(h => h.position.pageNumber === pageNumber)}
            selectedHighlightId={selectedHighlightId}
            onHighlightClick={onHighlightClick}
          />
        </Document>
      </div>
    </div>
  );
};
