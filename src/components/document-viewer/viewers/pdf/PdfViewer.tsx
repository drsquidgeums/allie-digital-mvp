
import React, { useState, useEffect, useCallback } from 'react';
import { PdfLoader, PdfHighlighter, Highlight, Popup, AreaHighlight } from 'react-pdf-highlighter';
import { useToast } from '@/hooks/use-toast';
import type { IHighlight, ScaledPosition } from 'react-pdf-highlighter';
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
}) => {
  const { toast } = useToast();
  const [highlights, setHighlights] = useState<Array<IHighlight>>([]);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  
  // Create object URL when file changes
  useEffect(() => {
    try {
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        console.log("Created object URL for file:", objectUrl);
        setFileUrl(objectUrl);
        setError(null);
        
        // Clean up the URL when component unmounts
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

  // Reset highlights when file changes
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
    return event.altKey;
  }, []);

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
    <div className="h-full pdf-container" style={{ '--highlight-color': selectedColor } as React.CSSProperties}>
      <PdfLoader 
        url={fileUrl} 
        beforeLoad={<div className="flex items-center justify-center h-full"><p className="animate-pulse">Loading PDF...</p></div>}
        errorMessage="Failed to load PDF document"
      >
        {(pdfDocument) => (
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
              const newHighlight = { 
                content, 
                position, 
                comment: {
                  text: '',
                  emoji: ''
                }, 
                id: `${Date.now()}` 
              };
              
              addHighlight(newHighlight);
              hideTipAndSelection();
              
              // Return an empty div element as required by the type
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
                  popupContent={<></>}
                  onMouseOver={(popupContent) => setTip(highlight, (highlight) => popupContent)}
                  onMouseOut={hideTip}
                  key={index}
                >
                  {component}
                </Popup>
              );
            }}
          />
        )}
      </PdfLoader>
    </div>
  );
};
