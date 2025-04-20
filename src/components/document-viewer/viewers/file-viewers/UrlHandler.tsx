
import React, { useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { IframeViewer } from '../IframeViewer';
import { PdfViewerWrapper } from './PdfViewerWrapper';
import { getUrlType, getEmbedUrl } from '../../urlUtils';
import { useToast } from '@/hooks/use-toast';

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
 * Provides specialized handling for different content types
 */
export const UrlHandler: React.FC<UrlHandlerProps> = ({
  url,
  selectedColor,
  isHighlighter,
  onError
}) => {
  const [loadError, setLoadError] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Get content type and prepare URL
  const contentType = getUrlType(url);
  const displayUrl = contentType === 'video' ? getEmbedUrl(url) : url;
  
  const handleUrlError = () => {
    console.error("Failed to load URL content:", url);
    setLoadError(true);
    onError();
    toast({
      title: "URL Load Error",
      description: "Could not load the requested URL. It may have security restrictions.",
      variant: "destructive"
    });
  };

  // Special handling for PDF URLs
  if (contentType === 'pdf') {
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
      <IframeViewer url={displayUrl} onError={handleUrlError} />
    </ErrorBoundary>
  );
};
