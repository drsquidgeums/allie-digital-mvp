import React from 'react';
import { PdfLoader, PdfHighlighter, Highlight } from 'react-pdf-highlighter-extended';
import { useToast } from "@/hooks/use-toast";
import type { PDFDocumentProxy } from 'pdfjs-dist';

interface PdfViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

interface HighlightContent {
  text?: string;
  image?: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = false
}) => {
  const { toast } = useToast();
  const [highlights, setHighlights] = React.useState<Highlight[]>([]);

  const getFileUrl = () => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return url;
  };

  const addHighlight = (highlight: Highlight) => {
    setHighlights([...highlights, highlight]);
    toast({
      title: "Highlight added",
      description: "Text has been highlighted"
    });
  };

  const renderLoader = () => {
    return <div className="text-center p-4">Loading PDF...</div>;
  };

  return (
    <div className="flex flex-col h-full">
      <PdfLoader 
        document={getFileUrl()}
        loadingRenderer={renderLoader}
      >
        {(pdfDocument: PDFDocumentProxy) => (
          <PdfHighlighter
            pdfDocument={pdfDocument}
            enableAreaSelection={false}
            highlights={highlights}
            onScrollChange={() => {}}
            scrollRef={(scrollTo) => {
              return scrollTo !== null;
            }}
            onSelectionFinished={(
              position,
              content,
              hideTipAndSelection,
              transformSelection
            ) => {
              addHighlight({
                content: content,
                position,
                id: `highlight-${Date.now()}`,
              });
              hideTipAndSelection();
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

              return (
                <div
                  key={index}
                  style={{
                    background: selectedColor || "#ffd400",
                    opacity: 0.4,
                  }}
                  onClick={() => {
                    setTip(highlight, () => (
                      <div>
                        {highlight.content.text && (
                          <div className="p-2">{highlight.content.text}</div>
                        )}
                      </div>
                    ));
                  }}
                  onMouseLeave={hideTip}
                />
              );
            }}
          />
        )}
      </PdfLoader>
    </div>
  );
};