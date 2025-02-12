
import React, { useState } from 'react';
import {
  PdfLoader,
  PdfHighlighter,
  Highlight,
  Popup,
  AreaHighlight,
  IHighlight,
  ScaledPosition,
  T_ViewportHighlight,
} from "react-pdf-highlighter";

interface PdfViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

type Comment = {
  text: string;
  emoji?: string;
};

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

  return (
    <div className="h-full" style={{ height: "100%" }}>
      <PdfLoader url={fileUrl} beforeLoad={<div>Loading...</div>}>
        {(pdfDocument) => (
          <PdfHighlighter
            pdfDocument={pdfDocument}
            enableAreaSelection={(event: MouseEvent) => true}
            onScrollChange={() => {}}
            scrollRef={(scrollTo) => {
              // You can implement custom scroll behavior here
            }}
            onSelectionFinished={(
              position: ScaledPosition,
              content: { text?: string; image?: string },
              hideTipAndSelection: () => void,
              transformSelection: () => void
            ) => {
              const highlight = {
                content,
                position,
                comment: { text: "" } as Comment,
                id: `highlight-${Date.now()}`
              };
              addHighlight(highlight);
              hideTipAndSelection();
              return <></>;
            }}
            highlightTransform={(
              highlight: T_ViewportHighlight<IHighlight>,
              index: number,
              setTip: (highlight: IHighlight, element: JSX.Element) => void,
              hideTip: () => void,
              viewportToScaled: (rect: DOMRect) => ScaledPosition,
              screenshot: (position: Object) => void,
              isScrolledTo: boolean
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
                  popupContent={<div>{highlight.comment?.text || ""}</div>}
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
