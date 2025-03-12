
import React from 'react';
import { Highlight, Popup, AreaHighlight } from 'react-pdf-highlighter';
import type { IHighlight } from 'react-pdf-highlighter';

interface PdfHighlightPopupProps {
  highlight: IHighlight;
  index: number;
  isScrolledTo: boolean;
  setTip: (highlight: IHighlight, callback: (highlight: IHighlight) => JSX.Element) => void;
  hideTip: () => void;
}

export const PdfHighlightPopup: React.FC<PdfHighlightPopupProps> = ({
  highlight,
  index,
  isScrolledTo,
  setTip,
  hideTip
}) => {
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
      popupContent={
        <div className="highlight-popup p-2">
          <div>{highlight.content.text}</div>
        </div>
      }
      onMouseOver={(popupContent) => setTip(highlight, (highlight) => popupContent)}
      onMouseOut={hideTip}
      key={String(index)}
    >
      {component}
    </Popup>
  );
};
