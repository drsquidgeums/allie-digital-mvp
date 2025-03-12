import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PdfLoader, PdfHighlighter } from 'react-pdf-highlighter';
import { useToast } from '@/hooks/use-toast';
import type { IHighlight, ScaledPosition } from 'react-pdf-highlighter';
import "@/styles/pdf/index.css";
import { PdfToolbar } from './components/PdfToolbar';
import { PdfHighlightPopup } from './components/PdfHighlightPopup';
import { PdfFooter } from './components/PdfFooter';
import { usePdfViewerControls } from './hooks/usePdfViewerControls';

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
  isHighlighter = true
}) => {
  const { toast } = useToast();
  const [highlights, setHighlights] = useState<Array<IHighlight>>([]);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    scale,
    rotation,
    currentPage,
    numPages,
    zoomIn,
    zoomOut,
    rotateClockwise,
    rotateCounterClockwise,
    goToPreviousPage,
    goToNextPage,
    updateCurrentPage,
    handleDocumentLoaded
  } = usePdfViewerControls();
  
  useEffect(() => {
    try {
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        console.log("Created object URL for file:", objectUrl);
        setFileUrl(objectUrl);
        setError(null);
        
        return () => {
          console.log("Revoking object URL:", objectUrl);
          URL.revokeObjectURL(objectUrl);
        };
      } else if (url) {
        console.log("Using provided URL:", url);
        setFileUrl(url);
        setError(null);
      } else {
        setFileUrl("");
      }
    } catch (err) {
      console.error("Error creating object URL:", err);
      setError("Failed to load PDF file");
    }
  }, [file, url]);

  useEffect(() => {
    setHighlights([]);
  }, [file, url]);

  const addHighlight = useCallback((highlight: IHighlight) => {
    console.log("Adding highlight:", highlight);
    setHighlights((prev) => [...prev, highlight]);
    toast({
      title: "Text highlighted",
      description: "Text has been highlighted successfully.",
      duration: 3000,
    });
  }, [toast]);

  const enableAreaSelection = useCallback((event: MouseEvent) => {
    return isHighlighter && event.altKey;
  }, [isHighlighter]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
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

  console.log("Rendering PDF with URL:", fileUrl);
  
  return (
    <div className="h-full flex flex-col">
      <PdfToolbar 
        scale={scale}
        rotation={rotation}
        currentPage={currentPage}
        numPages={numPages}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        rotateClockwise={rotateClockwise}
        rotateCounterClockwise={rotateCounterClockwise}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />
      
      <div 
        className="flex-1 overflow-auto pdf-container" 
        style={{ '--highlight-color': selectedColor } as React.CSSProperties}
        ref={containerRef}
      >
        <PdfLoader 
          url={fileUrl} 
          beforeLoad={<div className="flex items-center justify-center h-full"><p className="animate-pulse">Loading PDF...</p></div>}
          errorMessage={<div className="text-red-500">Failed to load PDF document</div>}
          onError={(error) => console.error("PDF loader error:", error)}
        >
          {(pdfDocument) => {
            if (numPages === 0) {
              handleDocumentLoaded(pdfDocument.numPages);
            }
            
            return (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={enableAreaSelection}
                onScrollChange={() => {}}
                scrollRef={(scrollTo) => scrollTo}
                highlights={highlights}
                onSelectionFinished={(
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection
                ) => {
                  if (!isHighlighter) {
                    hideTipAndSelection();
                    return <div />;
                  }
                  
                  const newHighlight = { 
                    content, 
                    position, 
                    comment: {
                      text: '',
                      emoji: ''
                    }, 
                    id: `highlight_${Date.now()}` 
                  };
                  
                  addHighlight(newHighlight);
                  hideTipAndSelection();
                  
                  return <div />;
                }}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo
                ) => (
                  <PdfHighlightPopup
                    highlight={highlight}
                    index={index}
                    isScrolledTo={isScrolledTo}
                    setTip={setTip}
                    hideTip={hideTip}
                  />
                )}
                pdfScaleValue={scale}
                rotation={rotation}
                pageLabelComponent={(props) => {
                  const { pageNumber } = props;
                  if (pageNumber === currentPage) {
                    updateCurrentPage(pageNumber);
                  }
                  return null;
                }}
              />
            );
          }}
        </PdfLoader>
      </div>
      
      <PdfFooter isHighlighter={isHighlighter} />
    </div>
  );
};
