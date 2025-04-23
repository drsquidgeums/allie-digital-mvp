
import React from 'react';

export interface HighlightItem {
  id: string;
  content: {
    text?: string;
    image?: string;
  };
  position: {
    boundingRect: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
      height: number;
    };
    pageNumber: number;
  };
  comment: {
    text: string;
    emoji?: string;
  };
  color?: string;
}

interface HighlightsOverlayProps {
  highlights: HighlightItem[];
  pageNumber: number;
  onSelectHighlight: (id: string | null) => void;
  selectedHighlightId: string | null;
}

export const HighlightsOverlay: React.FC<HighlightsOverlayProps> = ({
  highlights,
  pageNumber,
  onSelectHighlight,
  selectedHighlightId
}) => {
  const pageHighlights = highlights.filter(h => h.position.pageNumber === pageNumber);
  
  return (
    <div className="highlights-layer absolute top-0 left-0 w-full h-full pointer-events-none">
      {pageHighlights.map(highlight => (
        <div
          key={highlight.id}
          className="highlight-item pointer-events-auto"
          style={{
            position: 'absolute',
            left: `${highlight.position.boundingRect.x1}px`,
            top: `${highlight.position.boundingRect.y1}px`,
            width: `${highlight.position.boundingRect.width}px`,
            height: `${highlight.position.boundingRect.height}px`,
            backgroundColor: `${highlight.color}80`, // 50% opacity
            cursor: 'pointer'
          }}
          onClick={() => onSelectHighlight(
            selectedHighlightId === highlight.id ? null : highlight.id
          )}
        >
          {highlight.content.text && (
            <div className="highlight-tooltip opacity-0 hover:opacity-100 absolute bottom-full bg-white p-2 rounded shadow-md text-sm">
              {highlight.content.text}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
