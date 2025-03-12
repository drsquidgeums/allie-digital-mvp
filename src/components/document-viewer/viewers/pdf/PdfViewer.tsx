
import React, { useState } from 'react';
import { PdfLoader, PdfHighlighter, Highlight, Popup, AreaHighlight } from 'react-pdf-highlighter';
import { useToast } from '@/hooks/use-toast';
import type { IHighlight } from 'react-pdf-highlighter';

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
  const fileUrl = file ? URL.createObjectURL(file) : url;

  const addHighlight = (highlight: IHighlight) => {
    setHighlights([...highlights, highlight]);
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

  return (
    <div className="h-full pdf-container">
      <PdfLoader url={fileUrl} beforeLoad={<div>Loading...</div>}>
        {(pdfDocument) => (
          <PdfHighlighter
            pdfDocument={pdfDocument}
            enableAreaSelection={true}
            onScrollChange={() => {}}
            scrollRef={() => {}}
            highlights={highlights}
            onSelectionFinished={(
              position,
              content,
              hideTipAndSelection,
              transformSelection
            ) => {
              addHighlight({ content, position, comment: '', id: `${Date.now()}` });
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
