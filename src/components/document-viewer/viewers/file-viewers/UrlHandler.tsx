
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
  // Handle PDF URLs specifically
  if (url.toLowerCase().endsWith('.pdf') || url.includes('format=pdf')) {
    return (
      <PdfViewerWrapper
        file={null}
        url={url}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
      />
    );
  }

  // For all other URLs (including Google Docs), use the iframe viewer
  // The IframeViewer component now handles special cases for Google Docs
  return (
    <ErrorBoundary>
      <IframeViewer url={url} onError={onError} />
    </ErrorBoundary>
  );
};
