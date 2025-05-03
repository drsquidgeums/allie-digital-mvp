
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
  
  // Check if the URL is a Google Docs document
  useEffect(() => {
    const googleDocsRegex = /docs\.google\.com\/document|docs\.google\.com\/spreadsheets|docs\.google\.com\/presentation/i;
    const isGoogleDocsUrl = googleDocsRegex.test(url);
    
    setIsGoogleDoc(isGoogleDocsUrl);
    
    // For Google Docs, prepare a URL that exports to PDF if possible
    if (isGoogleDocsUrl && url.includes('/edit')) {
      // Try to convert the edit URL to an export URL for PDF
      try {
        const modifiedUrl = url
          .replace('/edit', '/export')
          .replace('/pub', '/export')
          + '?format=pdf'; 
          
        setDisplayUrl(modifiedUrl);
        console.log("Attempting to use export URL:", modifiedUrl);
      } catch (error) {
        console.error("Error transforming Google Docs URL:", error);
        // Fall back to original URL
        setDisplayUrl(url);
      }
    } else {
      setDisplayUrl(url);
    }
  }, [url]);

  if (isGoogleDoc) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-muted/10">
        <div className="max-w-md text-center space-y-4">
          <h3 className="text-lg font-medium">Google Docs Detected</h3>
          <p className="text-sm text-muted-foreground">
            Google Docs cannot be embedded directly in the document viewer due to security restrictions.
          </p>
          <div className="space-y-2">
            <p className="text-sm">You have a few options:</p>
            <ul className="text-sm text-left list-disc pl-5 space-y-1">
              <li>View the document in a new tab</li>
              <li>Download it as a PDF and upload to the document viewer</li>
              <li>Use the "Share" option in Google Docs and select "Publish to the web"</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm"
            >
              Open in New Tab
            </a>
            <a 
              href={displayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded text-sm"
            >
              Download PDF Version
            </a>
          </div>
        </div>
      </div>
    );
  }

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
