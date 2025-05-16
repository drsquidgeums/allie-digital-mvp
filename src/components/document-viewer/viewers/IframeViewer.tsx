
import React, { useState, useEffect } from 'react';

interface IframeViewerProps {
  url: string;
  onError: () => void;
}

/**
 * IframeViewer Component
 * 
 * Renders web content through an iframe with appropriate security settings.
 * Used for displaying web URLs and HTML content.
 * 
 * @param url - The URL to be displayed in the iframe
 * @param onError - Callback function triggered when iframe fails to load
 */
export const IframeViewer: React.FC<IframeViewerProps> = ({ url, onError }) => {
  const [processedUrl, setProcessedUrl] = useState<string>(url);

  useEffect(() => {
    // Process the URL to handle special cases like Google Docs
    const processUrl = (inputUrl: string): string => {
      try {
        // Handle Google Docs URLs
        if (inputUrl.includes('docs.google.com/document')) {
          // Make sure the URL includes /preview or /pub for embedding
          if (!inputUrl.includes('/preview') && !inputUrl.includes('/pub')) {
            // Convert edit URLs to preview URLs for embedding
            return inputUrl.replace(/\/edit(?:[^\/]*)?(?=#|$)/, '/preview');
          }
        }
        
        // Handle Google Sheets URLs
        if (inputUrl.includes('docs.google.com/spreadsheets')) {
          if (!inputUrl.includes('/preview') && !inputUrl.includes('/pubhtml')) {
            return inputUrl.replace(/\/edit(?:[^\/]*)?(?=#|$)/, '/preview');
          }
        }
        
        // Handle Google Slides URLs
        if (inputUrl.includes('docs.google.com/presentation')) {
          if (!inputUrl.includes('/preview') && !inputUrl.includes('/pub')) {
            return inputUrl.replace(/\/edit(?:[^\/]*)?(?=#|$)/, '/preview');
          }
        }
        
        return inputUrl;
      } catch (error) {
        console.error("Error processing URL:", error);
        return inputUrl;
      }
    };

    setProcessedUrl(processUrl(url));
  }, [url]);

  return (
    <div className="h-full relative">
      <iframe
        src={processedUrl}
        className="w-full h-full border-0"
        title="Document preview"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={onError}
      />
    </div>
  );
};
