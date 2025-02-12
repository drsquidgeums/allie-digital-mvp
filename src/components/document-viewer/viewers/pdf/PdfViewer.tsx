
import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { highlightPlugin, MessageIcon } from '@react-pdf-viewer/highlight';

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
  isHighlighter = false,
}) => {
  // Create the plugins
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const highlightPluginInstance = highlightPlugin({
    enableAreaSelection: true,
  });

  const fileUrl = file ? URL.createObjectURL(file) : url;

  return (
    <div className="h-full">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <div style={{ height: '100%' }}>
          <Viewer
            fileUrl={fileUrl}
            plugins={[
              defaultLayoutPluginInstance,
              highlightPluginInstance,
            ]}
            defaultScale={1.2}
            theme={{
              theme: 'auto'
            }}
          />
        </div>
      </Worker>
    </div>
  );
};
