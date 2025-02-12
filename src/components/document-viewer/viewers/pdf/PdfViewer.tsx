
import React, { useState } from 'react';
import { PdfLoader, PdfHighlighter, Tip, Highlight, AreaHighlight } from 'react-pdf-highlighter';
import { useToast } from "@/hooks/use-toast";
import type { IHighlight, ScaledPosition } from "react-pdf-highlighter";

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
                enableAreaSelection={(event: MouseEvent) => true}
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
                  return (
                    <div
                      className="bg-white p-2 shadow-lg rounded"
                      onClick={() => {
                        const highlight = {
                          id: `highlight-${Date.now()}`,
                          content,
                          position,
                          comment: {
                            text: "",
                            emoji: "💡"
                          }
                        };
                        addHighlight(highlight);
                        hideTipAndSelection();
                      }}
                    >
                      Click to add highlight
                    </div>
                  );
                }}
                highlights={highlights}
                onUpdateHighlight={updateHighlight}
                scrollToHighlight={scrollToHighlight}
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

export default PdfViewer;
