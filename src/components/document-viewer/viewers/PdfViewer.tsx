import React from 'react';
import { PdfLoader, PdfHighlighter, IHighlight } from 'react-pdf-highlighter-extended';
import { useToast } from "@/hooks/use-toast";
import type { Position, ScaledPosition } from 'react-pdf-highlighter-extended';

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

interface PdfHighlight extends IHighlight {
  content: HighlightContent;
  position: Position;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = false
}) => {
  const { toast } = useToast();
  const [highlights, setHighlights] = React.useState<PdfHighlight[]>([]);

  const getFileUrl = () => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return url;
  };

  const addHighlight = (highlight: PdfHighlight) => {
    setHighlights([...highlights, highlight]);
    toast({
      title: "Highlight added",
      description: "Text has been highlighted"
    });
  };

  return (
    <div className="flex flex-col h-full">
      <PdfLoader 
        url={getFileUrl()} 
        beforeLoad={<div className="text-center p-4">Loading PDF...</div>}
      >
        {(pdfDocument) => (
          <PdfHighlighter
            pdfDocument={pdfDocument}
            enableAreaSelection={true}
            highlights={highlights}
            onScrollChange={() => {}}
            scrollRef={() => {}}
            onSelectionFinished={(
              position,
              content,
              hideTipAndSelection,
              transformSelection
            ) => {
              addHighlight({
                content: { text: content.text },
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