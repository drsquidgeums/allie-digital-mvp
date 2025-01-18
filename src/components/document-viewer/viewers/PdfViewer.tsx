import React from 'react';
import { PdfLoader, PdfHighlighter, Highlight } from 'react-pdf-highlighter-extended';
import { useToast } from "@/hooks/use-toast";
import type { OnProgressParameters } from 'react-pdf-highlighter-extended';

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

  const renderLoader = (progress: OnProgressParameters) => {
    return <div className="text-center p-4">Loading PDF... {Math.round(progress.loaded / progress.total * 100)}%</div>;
  };

  return (
    <div className="flex flex-col h-full">
      <PdfLoader 
        url={getFileUrl()} 
        beforeLoad={renderLoader}
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
                comment: '',
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