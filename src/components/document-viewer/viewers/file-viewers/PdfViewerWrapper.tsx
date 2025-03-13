
import React, { Suspense, useEffect } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingFallback } from '../LoadingFallback';
import '@/styles/pdf/pdf-base.css';

// Lazy load the PDF viewer component
const CustomPDFViewer = React.lazy(() => 
  import('../pdf/components/CustomPDFViewer').then(module => ({
    default: module.CustomPDFViewer
  }))
);

interface PdfViewerWrapperProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

/**
 * PdfViewerWrapper Component
 * 
 * Wraps the PDF viewer component with error boundary and suspense
 */
export const PdfViewerWrapper: React.FC<PdfViewerWrapperProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = true
}) => {
  console.log("PdfViewerWrapper received file:", file?.name);
  console.log("PdfViewerWrapper color settings:", selectedColor, isHighlighter);
  
  // Log when loading PDF viewer
  useEffect(() => {
    if (file || url) {
      console.log("Loading PDF viewer with file:", file?.name, "or URL:", url);
      console.log("Using Custom PDF-LIB Viewer");
    }
  }, [file, url]);
  
  return (
    <div className="h-full overflow-auto">
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <CustomPDFViewer
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
