
import React, { Suspense } from 'react';
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
