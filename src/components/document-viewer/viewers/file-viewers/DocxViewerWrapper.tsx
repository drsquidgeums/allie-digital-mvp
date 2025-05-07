
import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingFallback } from '../LoadingFallback';

// Lazy load the DocxViewer component
const DocxViewer = lazy(() => import('../DocxViewer').then(module => ({
  default: module.DocxViewer
})));

interface DocxViewerWrapperProps {
  file: File;
}

/**
 * DocxViewerWrapper Component
 * 
 * Wraps the DocxViewer component with error boundary and suspense
 */
export const DocxViewerWrapper: React.FC<DocxViewerWrapperProps> = ({ file }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <DocxViewer file={file} />
      </Suspense>
    </ErrorBoundary>
  );
};
