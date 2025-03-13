
import React, { useState, useEffect } from 'react';
import { PDFTronToolbar } from './PDFTronToolbar';
import { PDFTronPagination } from './PDFTronPagination';
import { PDFTronViewerContainer } from './PDFTronViewerContainer';

interface PDFTronViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const PDFTronViewer: React.FC<PDFTronViewerProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = true
}) => {
  const [instance, setInstance] = useState<any>(null);

  // Update color when it changes
  useEffect(() => {
    if (instance && isHighlighter) {
      const { Core } = instance;
      try {
        const annotManager = Core.documentViewer.getAnnotationManager();
        const color = new Core.Annotations.Color(selectedColor);
        
        // Apply the new color
        annotManager.setTextHighlightColor(color);
      } catch (error) {
        console.error('Error updating highlight color:', error);
      }
    }
  }, [selectedColor, instance, isHighlighter]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (instance) {
        instance.UI.dispose();
      }
    };
  }, [instance]);

  // Handle the WebViewer instance ready event
  const handleInstanceReady = (webViewerInstance: any) => {
    setInstance(webViewerInstance);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-muted/30 p-2 border-b flex items-center justify-between">
        <PDFTronToolbar instance={instance} isHighlighter={isHighlighter} />
        <PDFTronPagination instance={instance} />
      </div>
      
      <PDFTronViewerContainer
        file={file}
        url={url}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
        onInstanceReady={handleInstanceReady}
      />
    </div>
  );
};
