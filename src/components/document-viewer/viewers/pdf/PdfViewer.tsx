
import React, { useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { highlightPlugin } from '@react-pdf-viewer/highlight';
import { useToast } from '@/hooks/use-toast';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';

import { usePdfViewerState } from './hooks/usePdfViewerState';
import { HighlightTarget } from './components/HighlightTarget';
import { HighlightRenderer } from './components/HighlightRenderer';

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
  const { toast } = useToast();
  const {
    fileUrl,
    isLoading,
    error,
    highlights,
    addHighlight,
    removeHighlight,
    setSelectedHighlight
  } = usePdfViewerState({ file, url });

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [...defaultTabs],
  });

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget: (props) => (
      <HighlightTarget
        {...props}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
        onHighlightCreated={(highlight) => {
          addHighlight(highlight);
          toast({
            title: "Text highlighted",
            description: `Text has been ${isHighlighter ? 'highlighted' : 'underlined'} successfully.`,
            duration: 3000,
          });
        }}
      />
    ),
    renderHighlights: (props) => (
      <HighlightRenderer 
        {...props} 
        areas={highlights}
        onHighlightClick={(highlight) => {
          setSelectedHighlight(highlight.id);
          console.log('Highlight clicked:', highlight);
        }}
      />
    ),
  });

  // Log when highlights change
  useEffect(() => {
    console.log('Current highlights:', highlights);
  }, [highlights]);

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
