
import React, { useEffect, useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { 
  highlightPlugin, 
  RenderHighlightTargetProps
} from '@react-pdf-viewer/highlight';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';

// Extend the HighlightArea interface with our custom properties
interface HighlightArea {
  id: string;
  pageIndex: number;
  top: number;
  left: number;
  width: number;
  height: number;
  selectedColor?: string;
  isHighlighter?: boolean;
}

interface CustomRenderHighlightsProps {
  pageIndex: number;
  areas?: HighlightArea[];
  onMouseEnter?: (area: HighlightArea) => void;
  onMouseLeave?: (area: HighlightArea) => void;
}

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
  const [error, setError] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<HighlightArea[]>([]);

  // Create the plugins
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [
      // Customize default tabs if needed
      ...defaultTabs,
    ],
  });

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
            onClick={() => {
              // Create a new highlight with our custom properties
              // Fixed: Explicitly handle the toggle() return value
              props.toggle();
              
              // Create a new highlight based on the selection region
              if (props.selectionRegion) {
                const newHighlight: HighlightArea = {
                  id: `highlight-${Date.now()}`,
                  pageIndex: props.pageIndex,
                  left: props.selectionRegion.left,
                  top: props.selectionRegion.top,
                  width: props.selectionRegion.width,
                  height: props.selectionRegion.height,
                  selectedColor,
                  isHighlighter
                };
                
                setHighlights(prev => [...prev, newHighlight]);
                console.log("Created highlight with color:", selectedColor, newHighlight);
              }
            }}
          >
            {isHighlighter ? 'Highlight' : 'Annotate'}
          </button>
        </div>
      </div>
    ),
    renderHighlights: (props: CustomRenderHighlightsProps) => (
      <div>
        {props.areas && Array.isArray(props.areas) && props.areas
          .filter(area => area.pageIndex === props.pageIndex)
          .map((highlight) => {
            const highlightColor = highlight.selectedColor || selectedColor;
            const isHighlighterMode = highlight.isHighlighter ?? isHighlighter;
            
            return (
              <div
                key={highlight.id}
                style={{
                  background: isHighlighterMode ? `${highlightColor}80` : 'transparent',
                  border: isHighlighterMode ? 'none' : `2px solid ${highlightColor}`,
                  borderRadius: '4px',
                  position: 'absolute',
                  left: `${highlight.left}px`,
                  top: `${highlight.top}px`,
                  height: `${highlight.height}px`,
                  width: `${highlight.width}px`,
                  zIndex: 1,
                }}
                onMouseEnter={() => props.onMouseEnter && props.onMouseEnter(highlight)}
              />
            );
          })}
      </div>
    ),
  });

  useEffect(() => {
    console.log("PdfViewer received file:", file?.name);
    console.log("PdfViewer received url:", url);
    console.log("Current highlight color:", selectedColor, "isHighlighter:", isHighlighter);
    
    setIsLoading(true);
    setError(null);
    
    if (file) {
      try {
        // Create a URL for the file object
        const objectUrl = URL.createObjectURL(file);
        console.log("Created object URL:", objectUrl);
        setFileUrl(objectUrl);
        setIsLoading(false);
        
        // Clean up the URL when the component is unmounted
        return () => {
          URL.revokeObjectURL(objectUrl);
        };
      } catch (err) {
        console.error("Error creating object URL:", err);
        setError(err instanceof Error ? err.message : "Failed to load PDF file");
        setIsLoading(false);
      }
    } else if (url) {
      setFileUrl(url);
      setIsLoading(false);
    } else {
      setFileUrl('');
      setIsLoading(false);
    }
  }, [file, url, selectedColor, isHighlighter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error: {error}</p>
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
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
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
            renderError={(error) => {
              console.error("PDF Viewer error:", error);
              return (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-500">Failed to load PDF: {error.message}</p>
                </div>
              );
            }}
          />
        </div>
      </Worker>
    </div>
  );
};
