
import React, { useEffect, useState } from 'react';

interface IframeViewerProps {
  url: string;
  onError: () => void;
}

/**
 * IframeViewer Component
 * 
 * Renders web content through an iframe with appropriate security settings.
 * Used for displaying web URLs and HTML content.
 * Handles special cases for services that don't allow embedding.
 * 
 * @param url - The URL to be displayed in the iframe
 * @param onError - Callback function triggered when iframe fails to load
 */
export const IframeViewer: React.FC<IframeViewerProps> = ({ url, onError }) => {
  const [isGoogleDoc, setIsGoogleDoc] = useState<boolean>(false);
  const [displayUrl, setDisplayUrl] = useState<string>(url);
  
  // Check if the URL is a Google Docs document and process it for viewing
  useEffect(() => {
    // Check if it's a Google Docs URL
    const googleDocsRegex = /docs\.google\.com\/document|docs\.google\.com\/spreadsheets|docs\.google\.com\/presentation/i;
    const isGoogleDocsUrl = googleDocsRegex.test(url);
    
    setIsGoogleDoc(isGoogleDocsUrl);
    
    if (isGoogleDocsUrl) {
      // Format the URL for embedding
      try {
        // Convert the URL to an embeddable format
        let formattedUrl = url;
        
        // Step 1: Remove any query parameters first
        formattedUrl = formattedUrl.split('?')[0];
        
        // Step 2: Ensure we're using /preview instead of /edit or /view
        if (formattedUrl.includes('/edit')) {
          formattedUrl = formattedUrl.replace('/edit', '/preview');
        } else if (formattedUrl.includes('/view')) {
          formattedUrl = formattedUrl.replace('/view', '/preview');
        } else if (!formattedUrl.includes('/preview')) {
          // If neither edit nor view is in the URL, make sure it ends with /preview
          if (formattedUrl.endsWith('/')) {
            formattedUrl += 'preview';
          } else {
            formattedUrl += '/preview';
          }
        }
        
        // Step 3: Add embedding parameters
        if (!formattedUrl.includes('?')) {
          formattedUrl += '?embedded=true&rm=minimal';
        } else {
          formattedUrl += '&embedded=true&rm=minimal';
        }
        
        console.log("Formatted Google Docs URL:", formattedUrl);
        setDisplayUrl(formattedUrl);
      } catch (error) {
        console.error("Error transforming Google Docs URL:", error);
        setDisplayUrl(url);
      }
    } else {
      setDisplayUrl(url);
    }
  }, [url]);

  return (
    <div className="h-full relative">
      <iframe
        src={displayUrl}
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
