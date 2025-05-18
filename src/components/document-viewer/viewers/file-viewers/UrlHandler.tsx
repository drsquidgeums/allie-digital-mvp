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
  
  // Special handling for Google Docs URLs
  if (isGoogleDocsUrl(url)) {
    // Convert Google Docs URL to an embeddable format
    processedUrl = convertToEmbeddableGoogleUrl(url);
    
    // Add parameters required for proper embedding
    if (!processedUrl.includes('embedded=true')) {
      processedUrl += (processedUrl.includes('?') ? '&' : '?') + 'embedded=true';
    }
    
    return (
      <ErrorBoundary>
        <IframeViewer url={processedUrl} onError={onError} />
      </ErrorBoundary>
    );
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

  // Other URLs are handled by IframeViewer
  return (
    <ErrorBoundary>
      <IframeViewer url={processedUrl} onError={onError} />
    </ErrorBoundary>
  );
};
