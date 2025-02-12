
import React, { useState } from 'react';
import {
  PdfLoader,
  PdfHighlighter,
  Highlight,
  Popup,
  AreaHighlight,
  IHighlight,
} from "react-pdf-highlighter";

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
  isHighlighter = false,
}) => {
  const [highlights, setHighlights] = useState<Array<IHighlight>>([]);
  const fileUrl = file ? URL.createObjectURL(file) : url;

  const addHighlight = (highlight: IHighlight) => {
    setHighlights([...highlights, highlight]);
  };

  const updateHighlight = (highlightId: string, position: Object) => {
    setHighlights(
      highlights.map((h) => {
        const {
          id,
          position: originalPosition,
          content,
          ...rest
        } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content,
              ...rest,
            }
          : h;
      })
    );
  };

  const scrollToHighlight = (highlight: IHighlight) => {
    // This function can be implemented if you want to add scroll functionality
  };

  return (
    <div className="h-full" style={{ height: "100%" }}>
      <PdfLoader url={fileUrl} beforeLoad={<div>Loading...</div>}>
        {(pdfDocument) => (
          <PdfHighlighter
            pdfDocument={pdfDocument}
            enableAreaSelection={true}
            onScrollChange={() => {}}
            scrollRef={(scrollTo) => {
              // You can implement custom scroll behavior here
            }}
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
                id: `highlight-${Date.now()}` 
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
                <Highlight
                  isScrolledTo={isScrolledTo}
                  position={highlight.position}
                  comment={highlight.comment}
                />
              ) : (
                <AreaHighlight
                  isScrolledTo={isScrolledTo}
                  highlight={highlight}
                  onChange={(boundingRect) => {
                    updateHighlight(highlight.id, boundingRect);
                  }}
                />
              );

              return (
                <Popup
                  popupContent={<div>{highlight.comment}</div>}
                  onMouseOver={(popupContent) => setTip(highlight, popupContent)}
                  onMouseOut={hideTip}
                  key={index}
                >
                  {component}
                </Popup>
              );
            }}
            highlights={highlights}
          />
        )}
      </PdfLoader>
    </div>
  );
};
