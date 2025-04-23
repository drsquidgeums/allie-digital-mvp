
import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { IframeViewer } from '../IframeViewer';
import { PdfViewerWrapper } from './PdfViewerWrapper';

interface UrlHandlerProps {
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
  onError: () => void;
}

/**
 * UrlHandler Component
 * 
 * Handles display of URL content based on URL type
 */
export const UrlHandler: React.FC<UrlHandlerProps> = ({
  url,
  selectedColor,
  isHighlighter,
  onError
}) => {
  console.log("UrlHandler received URL:", url);
  
  // Special handling for PDF URLs
  if (url.toLowerCase().endsWith('.pdf')) {
    console.log("Rendering PDF viewer for URL:", url);
    return (
      <PdfViewerWrapper
        file={null}
        url={url}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
      />
    );
  }

  // Handle all other URLs with iframe
  return (
    <ErrorBoundary>
      <IframeViewer url={url} onError={onError} />
    </ErrorBoundary>
  );
};
