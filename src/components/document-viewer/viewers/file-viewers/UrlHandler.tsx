
import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { IframeViewer } from '../IframeViewer';
import { PdfViewerWrapper } from './PdfViewerWrapper';
import { isGoogleDocsUrl, convertToEmbeddableGoogleUrl } from '../../urlUtils';

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
  // Process the URL for proper handling
  let processedUrl = url;
  
  // Special handling for Google Docs URLs to ensure they work across different contexts
  if (isGoogleDocsUrl(url)) {
    processedUrl = convertToEmbeddableGoogleUrl(url);
    
    // Add additional parameters to force Google auth to work in new tabs
    if (!processedUrl.includes('embedded=true')) {
      processedUrl += (processedUrl.includes('?') ? '&' : '?') + 'embedded=true';
    }
    
    // Ensure authuser parameter is present for better cross-origin auth handling
    if (!processedUrl.includes('authuser=')) {
      processedUrl += '&authuser=0';
    }
  }

  // Special handling for PDF URLs
  if (url.toLowerCase().endsWith('.pdf')) {
    return (
      <PdfViewerWrapper
        file={null}
        url={url}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
      />
    );
  }

  // Google Docs and other document URLs are handled by IframeViewer
  return (
    <ErrorBoundary>
      <IframeViewer url={processedUrl} onError={onError} />
    </ErrorBoundary>
  );
};
