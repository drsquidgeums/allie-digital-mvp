
import React, { Suspense, useEffect } from 'react';
import { lazy } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingFallback } from '../LoadingFallback';

// Lazy load the PdfViewer component
const PdfViewer = lazy(() => import('../pdf/PdfViewer').then(module => ({
  default: module.PdfViewer
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
 * Wraps the PdfViewer component with error boundary and suspense
 */
export const PdfViewerWrapper: React.FC<PdfViewerWrapperProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter
}) => {
  console.log("PdfViewerWrapper received file:", file?.name);
  console.log("PdfViewerWrapper color settings:", selectedColor, isHighlighter);
  
  // Log the PDF.js versions
  useEffect(() => {
    if (file || url) {
      console.log("Loading PDF viewer with file:", file?.name, "or URL:", url);
      
      // Force load the correct worker version
      const preloadWorker = async () => {
        try {
          const worker = await import('pdfjs-dist/build/pdf.worker.entry');
          console.log("PDF worker loaded:", worker);
        } catch (error) {
          console.error("Failed to preload PDF worker:", error);
        }
      };
      
      preloadWorker();
    }
  }, [file, url]);
  
  return (
    <div className="h-full overflow-auto">
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <PdfViewer
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
