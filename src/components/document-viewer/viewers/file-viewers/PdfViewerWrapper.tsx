
import React, { Suspense, useEffect } from 'react';
import { lazy } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingFallback } from '../LoadingFallback';
import '@/styles/pdf/pdf-base.css';
import * as pdfjs from 'pdfjs-dist';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Lazy load the PdfViewer component
const PDFTronViewer = lazy(() => import('../pdf/components/PDFTronViewer').then(module => ({
  default: module.PDFTronViewer
})));

interface PdfViewerWrapperProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

/**
 * PdfViewerWrapper Component
 * 
 * Wraps the PDFTron viewer component with error boundary and suspense
 */
export const PdfViewerWrapper: React.FC<PdfViewerWrapperProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = true
}) => {
  console.log("PdfViewerWrapper received file:", file?.name);
  console.log("PdfViewerWrapper color settings:", selectedColor, isHighlighter);
  
  // Log the PDF.js versions
  useEffect(() => {
    if (file || url) {
      console.log("Loading PDF viewer with file:", file?.name, "or URL:", url);
      console.log("Using PDFTron WebViewer");
    }
  }, [file, url]);
  
  return (
    <div className="h-full overflow-auto">
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <PDFTronViewer
            file={file}
            url={url}
            selectedColor={selectedColor}
            isHighlighter={isHighlighter}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
