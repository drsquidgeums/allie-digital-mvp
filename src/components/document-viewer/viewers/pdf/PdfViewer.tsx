
import React, { useState, useEffect } from 'react';
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
  
  // Create object URL when file changes
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setFileUrl(objectUrl);
      
      // Clean up the URL when component unmounts
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (url) {
      setFileUrl(url);
    }
  }, [file, url]);

  // Reset highlights when file changes
  useEffect(() => {
    setHighlights([]);
  }, [file, url]);

  const addHighlight = (highlight: IHighlight) => {
    console.log("Adding highlight:", highlight);
    setHighlights((prev) => [...prev, highlight]);
    toast({
      title: "Text highlighted",
      description: "Text has been highlighted successfully.",
      duration: 3000,
    });
  };

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
      <PdfLoader url={fileUrl} beforeLoad={<div className="flex items-center justify-center h-full">Loading PDF...</div>}>
        {(pdfDocument) => (
          <PdfHighlighter
            pdfDocument={pdfDocument}
            enableAreaSelection={(event) => event.altKey}
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
