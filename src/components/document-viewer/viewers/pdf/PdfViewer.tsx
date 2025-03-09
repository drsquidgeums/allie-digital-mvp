
import React, { useEffect, useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { 
  highlightPlugin, 
  RenderHighlightTargetProps, 
  RenderHighlightsProps 
} from '@react-pdf-viewer/highlight';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';

interface PdfViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = false
}) => {
  const [fileUrl, setFileUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Create the plugins
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [
      // Customize default tabs if needed
      ...defaultTabs,
    ],
  });

  // Create the highlight plugin with custom settings
  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget: (props: RenderHighlightTargetProps) => (
      <div
        style={{
          background: 'white',
          border: '1px solid rgba(0, 0, 0, 0.3)',
          borderRadius: '2px',
          padding: '8px',
          position: 'absolute',
          left: `${props.selectionRegion.left}px`,
          top: `${props.selectionRegion.top + props.selectionRegion.height}px`,
          zIndex: 1,
        }}
      >
        <div>
          <button
            style={{
              background: selectedColor,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              padding: '8px',
              color: isHighlighter ? 'black' : 'white',
            }}
            onClick={() => props.trigger()}
          >
            {isHighlighter ? 'Highlight' : 'Annotate'}
          </button>
        </div>
      </div>
    ),
    renderHighlights: (props: RenderHighlightsProps) => (
      <div>
        {props.pageIndex === props.currentPage && props.annotations
          .filter(annotation => annotation.pageIndex === props.pageIndex)
          .map((highlight) => (
            <div
              key={highlight.id}
              style={{
                background: isHighlighter ? `${selectedColor}80` : 'transparent',
                border: isHighlighter ? 'none' : `2px solid ${selectedColor}`,
                borderRadius: '4px',
                position: 'absolute',
                left: `${highlight.bounds.left}px`,
                top: `${highlight.bounds.top}px`,
                height: `${highlight.bounds.height}px`,
                width: `${highlight.bounds.width}px`,
                zIndex: 1,
              }}
              onMouseEnter={() => props.jumpToHighlight(highlight)}
            />
          ))}
      </div>
    ),
  });

  useEffect(() => {
    setIsLoading(true);
    if (file) {
      // Create a URL for the file object
      const objectUrl = URL.createObjectURL(file);
      setFileUrl(objectUrl);
      setIsLoading(false);
      
      // Clean up the URL when the component is unmounted
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (url) {
      setFileUrl(url);
      setIsLoading(false);
    } else {
      setFileUrl('');
      setIsLoading(false);
    }
  }, [file, url]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!fileUrl) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>No PDF file selected</p>
      </div>
    );
  }

  return (
    <div className="h-full pdf-container">
      <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js">
        <div style={{ height: '100%' }}>
          <Viewer
            fileUrl={fileUrl}
            plugins={[
              defaultLayoutPluginInstance,
              highlightPluginInstance,
            ]}
            defaultScale={1.0}
            theme={{
              theme: 'light',
            }}
            renderError={(error) => (
              <div className="flex items-center justify-center h-full">
                <p>Failed to load PDF: {error.message}</p>
              </div>
            )}
          />
        </div>
      </Worker>
    </div>
  );
};
