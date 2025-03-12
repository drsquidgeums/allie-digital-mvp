
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PdfLoader, PdfHighlighter, Highlight, Popup, AreaHighlight } from 'react-pdf-highlighter';
import { useToast } from '@/hooks/use-toast';
import type { IHighlight, ScaledPosition } from 'react-pdf-highlighter';
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import "@/styles/pdf-viewer.css";

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
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
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
    setScale(1.0);
    setRotation(0);
    setCurrentPage(1);
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

  const updateCurrentPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleDocumentLoaded = (numPages: number) => {
    console.log(`Document loaded with ${numPages} pages`);
    setNumPages(numPages);
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.2, 3));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
  };

  const rotateClockwise = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  const rotateCounterClockwise = () => {
    setRotation((prevRotation) => (prevRotation - 90 + 360) % 360);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, numPages));
  };

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
      <div className="bg-muted/30 p-2 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={zoomOut} 
            disabled={scale <= 0.5}
            title="Zoom out"
          >
            <ZoomOut size={16} />
          </Button>
          <span className="text-xs">{Math.round(scale * 100)}%</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={zoomIn} 
            disabled={scale >= 3}
            title="Zoom in"
          >
            <ZoomIn size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={rotateCounterClockwise}
            title="Rotate counterclockwise"
          >
            <RotateCcw size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={rotateClockwise}
            title="Rotate clockwise"
          >
            <RotateCw size={16} />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToPreviousPage} 
            disabled={currentPage <= 1}
            title="Previous page"
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-xs">Page {currentPage} of {numPages || '?'}</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToNextPage} 
            disabled={currentPage >= numPages}
            title="Next page"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
      
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
                ) => {
                  const isTextHighlight = !Boolean(highlight.content && highlight.content.image);

                  const component = isTextHighlight ? (
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.comment}
                    />
                  ) : (
                    <AreaHighlight
                      isScrolledTo={isScrolledTo}
                      highlight={highlight}
                      onChange={() => {}}
                    />
                  );

                  return (
                    <Popup
                      popupContent={
                        <div className="highlight-popup p-2">
                          <div>{highlight.content.text}</div>
                        </div>
                      }
                      onMouseOver={(popupContent) => setTip(highlight, (highlight) => popupContent)}
                      onMouseOut={hideTip}
                      key={index.toString()} // Fixed the TypeScript error by converting index to string
                    >
                      {component}
                    </Popup>
                  );
                }}
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
      
      {isHighlighter && (
        <div className="text-xs text-muted-foreground p-2 border-t">
          To highlight an area, hold Alt key and drag. To highlight text, simply select it.
        </div>
      )}
    </div>
  );
};
