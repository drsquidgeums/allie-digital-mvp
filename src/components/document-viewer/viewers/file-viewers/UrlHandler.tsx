
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
  
  // Special handling for Google Docs URLs - now just showing the link instead of embedding
  if (isGoogleDocsUrl(url)) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-background">
        <div className="max-w-2xl w-full text-center p-6 border border-border rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">Google Document Link</h3>
          <p className="mb-4 text-muted-foreground text-sm">
            This is a link to a Google document. Click below to open it in a new tab.
          </p>
          <a 
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Open Google Document
          </a>
        </div>
      </div>
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

  // Google Docs and other document URLs are handled by IframeViewer
  return (
    <ErrorBoundary>
      <IframeViewer url={processedUrl} onError={onError} />
    </ErrorBoundary>
  );
};
