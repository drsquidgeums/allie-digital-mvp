
import React, { useState, useEffect } from 'react';
import { PdfViewerWrapper } from './PdfViewerWrapper';
import { ErrorDisplay } from '../ErrorDisplay';
import { useToast } from '@/hooks/use-toast';

interface UrlHandlerProps {
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
  onError: () => void;
}

export const UrlHandler: React.FC<UrlHandlerProps> = ({
  url,
  selectedColor,
  isHighlighter,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [contentType, setContentType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkUrl = async () => {
      if (!url) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Try to fetch the headers to determine content type
        const response = await fetch(url, { method: 'HEAD' });
        
        if (!response.ok) {
          throw new Error(`Failed to load URL: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        setContentType(contentType);
        
        if (contentType?.includes('application/pdf')) {
          // It's a PDF
          toast({
            title: "PDF detected",
            description: "Loading PDF from URL",
          });
        } else if (contentType?.includes('text/html')) {
          // It's an HTML document
          toast({
            title: "HTML detected",
            description: "Loading HTML document from URL",
          });
        } else {
          // Unsupported content type
          throw new Error(`Unsupported content type: ${contentType}`);
        }
      } catch (error) {
        console.error('Error fetching URL:', error);
        setError('Failed to load URL. Please check the URL and try again.');
        onError();
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUrl();
  }, [url, onError, toast]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <ErrorDisplay 
        title="URL Error" 
        description={error}
      />
    );
  }

  // Handle PDF content
  if (contentType?.includes('application/pdf')) {
    return (
      <PdfViewerWrapper
        file={null}
        url={url}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
      />
    );
  }
  
  // For now, we'll just embed HTML content in an iframe
  if (contentType?.includes('text/html')) {
    return (
      <div className="h-full w-full">
        <iframe
          src={url}
          className="w-full h-full border-0"
          title="HTML document"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    );
  }
  
  // Fallback - should be caught by the content type check above
  return (
    <ErrorDisplay 
      title="Unsupported Content"
      description="This URL contains content that we cannot display. Only PDF and HTML documents are supported."
    />
  );
};
