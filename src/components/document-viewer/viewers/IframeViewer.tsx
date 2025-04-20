
import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface IframeViewerProps {
  url: string;
  onError: () => void;
}

/**
 * IframeViewer Component
 * 
 * Renders web content through an iframe with appropriate security settings.
 * Used for displaying web URLs and HTML content.
 * Handles various cross-origin and security restrictions gracefully.
 * 
 * @param url - The URL to be displayed in the iframe
 * @param onError - Callback function triggered when iframe fails to load
 */
export const IframeViewer: React.FC<IframeViewerProps> = ({ url, onError }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
  }, [url]);

  const handleLoad = () => {
    console.log("IframeViewer: Content loaded successfully");
    setLoading(false);
  };

  const handleError = () => {
    console.error("IframeViewer: Failed to load content from URL:", url);
    setError("This URL cannot be displayed due to security restrictions");
    setLoading(false);
    onError();
  };

  // Check if URL is potentially problematic (some domains are known to block iframe embedding)
  const isRestrictedDomain = () => {
    try {
      const urlDomain = new URL(url).hostname;
      const restrictedDomains = [
        'proton.me',
        'protonmail.com',
        'docs.proton.me',
        'github.com',
        'notion.so',
        'google.com',
        'mail.google.com'
      ];
      
      return restrictedDomains.some(domain => urlDomain.includes(domain));
    } catch (e) {
      return false;
    }
  };

  if (isRestrictedDomain()) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Connection Restricted</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              This URL ({url}) cannot be displayed in an iframe due to security restrictions set by the website.
            </p>
            <p className="text-sm">
              Many secure websites (including Proton, GitHub, Google) restrict embedding in iframes to protect user security.
            </p>
            <div className="mt-4">
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Open URL in new tab instead
              </a>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-6 z-20">
          <Alert variant="destructive" className="max-w-lg">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              <p className="mb-2">{error}</p>
              <p className="text-sm">
                This may be due to the website's security policy (X-Frame-Options or Content-Security-Policy).
              </p>
              <div className="mt-4">
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Open URL in new tab instead
                </a>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <iframe
        src={url}
        className="w-full h-full border-0"
        title="Document preview"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};
