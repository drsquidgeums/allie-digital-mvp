
import React, { useState, useEffect, useRef } from 'react';
import { isGoogleDocsUrl } from '../urlUtils';

interface IframeViewerProps {
  url: string;
  onError?: () => void;
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
export const IframeViewer: React.FC<IframeViewerProps> = ({ 
  url, 
  onError = () => {} 
}) => {
  const [processedUrl, setProcessedUrl] = useState<string>(url);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [key, setKey] = useState<number>(0); // Key for forcing iframe reload

  useEffect(() => {
    // Force iframe reload when URL changes
    setKey(prev => prev + 1);
    
    // Process the URL to handle special cases like Google Docs
    const processUrl = (inputUrl: string): string => {
      try {
        // Handle Google Docs URLs
        if (inputUrl.includes('docs.google.com/document')) {
          // For Google Docs, ensure it's in edit mode for editing capabilities
          if (!inputUrl.includes('/edit')) {
            return inputUrl.replace(/\/preview(?:[^\/]*)?(?=#|$)/, '/edit')
                          .replace(/\/pub(?:[^\/]*)?(?=#|$)/, '/edit');
          }
        }
        
        // Handle Google Sheets URLs
        if (inputUrl.includes('docs.google.com/spreadsheets')) {
          if (!inputUrl.includes('/edit')) {
            return inputUrl.replace(/\/preview(?:[^\/]*)?(?=#|$)/, '/edit')
                          .replace(/\/pubhtml(?:[^\/]*)?(?=#|$)/, '/edit');
          }
        }
        
        // Handle Google Slides URLs
        if (inputUrl.includes('docs.google.com/presentation')) {
          if (!inputUrl.includes('/edit')) {
            return inputUrl.replace(/\/preview(?:[^\/]*)?(?=#|$)/, '/edit')
                          .replace(/\/pub(?:[^\/]*)?(?=#|$)/, '/edit');
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

  // Determine if we need additional sandbox permissions for Google Docs
  const isGoogleDoc = isGoogleDocsUrl(url);

  // Function to handle iframe loading errors
  const handleIframeError = () => {
    console.error("Failed to load iframe content");
    if (onError) onError();
  };
  
  return (
    <div className="h-full relative">
      <iframe
        key={key} // Force reload when key changes
        ref={iframeRef}
        src={processedUrl}
        className="w-full h-full border-0"
        title="Document preview"
        sandbox={isGoogleDoc 
          ? "allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox allow-downloads allow-modals allow-top-navigation allow-presentation"
          : "allow-same-origin allow-scripts allow-popups allow-forms"}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={handleIframeError}
        allow="fullscreen"
      />
    </div>
  );
};
