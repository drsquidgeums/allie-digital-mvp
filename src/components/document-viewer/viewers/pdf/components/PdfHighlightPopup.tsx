
import React from 'react';
import { Highlight, Popup, AreaHighlight } from 'react-pdf-highlighter';
import type { IHighlight } from 'react-pdf-highlighter';

interface PdfHighlightPopupProps {
  highlight: IHighlight;
  index: number | string;
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

  // Cast the position to any to work around the type mismatch
  const component = isTextHighlight ? (
    <Highlight
      isScrolledTo={isScrolledTo}
      position={highlight.position as any}
      comment={highlight.comment}
    />
  ) : (
    <AreaHighlight
      isScrolledTo={isScrolledTo}
      highlight={highlight as any}
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
      key={typeof index === 'number' ? String(index) : index}
    >
      {component}
    </Popup>
  );
};
