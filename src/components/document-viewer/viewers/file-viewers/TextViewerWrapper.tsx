
import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingFallback } from '../LoadingFallback';

// Lazy load the TextViewer component
const TextViewer = lazy(() => import('../TextViewer').then(module => ({
  default: module.TextViewer
})));

interface TextViewerWrapperProps {
  file: File;
}

/**
 * TextViewerWrapper Component
 * 
 * Wraps the TextViewer component with error boundary and suspense
 */
export const TextViewerWrapper: React.FC<TextViewerWrapperProps> = ({ file }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <TextViewer file={file} />
      </Suspense>
    </ErrorBoundary>
  );
};
