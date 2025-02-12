
import React, { useState } from 'react';
import { PdfLoader, PdfHighlighter, Tip, Highlight, AreaHighlight } from 'react-pdf-highlighter';
import { useToast } from "@/hooks/use-toast";
import type { IHighlight } from "react-pdf-highlighter";

interface PdfViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

const getFileUrl = (file: File | null, url: string): string => {
  if (file) {
    return URL.createObjectURL(file);
  }
  return url;
};

export const PdfViewer: React.FC<PdfViewerProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = false,
}) => {
  const [highlights, setHighlights] = useState<Array<IHighlight>>([]);
  const { toast } = useToast();

  const addHighlight = (highlight: IHighlight) => {
    setHighlights([...highlights, highlight]);
    toast({
      title: "Highlight added",
      description: "Your highlight has been saved",
    });
  };

  const updateHighlight = (highlightId: string, position: Object, content: Object) => {
    setHighlights(
      highlights.map((h) =>
        h.id === highlightId
          ? {
              ...h,
              position: { ...h.position, ...position },
              content: { ...h.content, ...content },
            }
          : h
      )
    );
  };

  const scrollToHighlight = (highlight: IHighlight) => {
    // Handled by the library
  };

  return (
    <div className="flex flex-col h-full">
      {(file || url) ? (
        <div style={{ height: "100%" }}>
          <PdfLoader url={getFileUrl(file, url)} beforeLoad={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          }>
            {(pdfDocument) => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={true}
                onScrollChange={() => {}}
                scrollRef={(scrollTo) => {
                  console.log("Scroll to:", scrollTo);
                }}
                onSelectionFinished={(
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection
                ) => {
                  const highlight = {
                    id: `highlight-${Date.now()}`,
                    content,
                    position,
                    comment: ""
                  };

                  addHighlight(highlight);
                  hideTipAndSelection();
                }}
                highlights={highlights}
                onHighlightClick={(highlight) => {
                  console.log("Clicked highlight:", highlight);
                }}
                onHighlightUpdate={updateHighlight}
                scrollToHighlight={scrollToHighlight}
                HighlightLayer={HighlightLayer}
              />
            )}
          </PdfLoader>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Please upload a PDF file or provide a URL
        </div>
      )}
    </div>
  );
};

// Custom highlight layer component
const HighlightLayer: React.FC<{
  highlights: Array<IHighlight>;
  scale: number;
  rotation: number;
}> = ({ highlights, scale, rotation }) => {
  return (
    <div>
      {highlights.map((highlight) => {
        const { position, content, id } = highlight;
        
        if (!content || !position) return null;

        return (
          <div
            key={id}
            style={{
              position: "absolute",
              background: "rgba(255, 226, 143, 0.4)",
              ...position.boundingRect,
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transformOrigin: "top left"
            }}
          />
        );
      })}
    </div>
  );
};

export default PdfViewer;
