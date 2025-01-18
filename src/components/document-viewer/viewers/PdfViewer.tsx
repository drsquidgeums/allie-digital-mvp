import React from 'react';
import { PdfLoader, PdfHighlighter, Highlight, Popup, AreaHighlight } from 'react-pdf-highlighter-extended';
import { useToast } from "@/hooks/use-toast";
import { PdfPageControls } from './pdf/PdfPageControls';

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
      variant: "default",
      children: "Text has been highlighted"
    });
  };

  return (
    <div className="flex flex-col h-full">
      <PdfLoader url={getFileUrl()} beforeLoad={<div>Loading PDF...</div>}>
        {(pdfDocument) => (
          <PdfHighlighter
            pdfDocument={pdfDocument}
            enableAreaSelection={true}
            highlights={highlights}
            onScrollChange={() => {}}
            scrollRef={(scrollTo) => {}}
            onSelectionFinished={(
              position,
              content,
              hideTipAndSelection,
              transformSelection
            ) => {
              addHighlight({
                content,
                position,
                comment: "",
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

              const component = isTextHighlight ? (
                <Popup
                  popupContent={<div>{highlight.content.text}</div>}
                  onMouseOver={(popupContent) => setTip(highlight, (highlight) => popupContent)}
                  onMouseOut={hideTip}
                  key={index}
                >
                  <div
                    style={{
                      background: selectedColor || "#ffd400",
                      opacity: 0.4,
                    }}
                  />
                </Popup>
              ) : (
                <AreaHighlight
                  highlight={highlight}
                  onChange={(boundingRect) => {
                    console.log("Highlight changed:", boundingRect);
                  }}
                />
              );

              return component;
            }}
          />
        )}
      </PdfLoader>
    </div>
  );
};