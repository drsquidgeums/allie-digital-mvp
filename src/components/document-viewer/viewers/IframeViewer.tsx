
import React from 'react';

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
  return (
    <div className="h-full relative">
      <iframe
        src={url}
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
