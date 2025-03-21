
import React from 'react';

export interface Highlight {
  id: string;
  pageNumber: number;
  content: string;
  position: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  color: string;
}

interface HighlightLayerProps {
  highlights: Highlight[];
  currentPage: number;
  selectedHighlightId: string | null;
  onHighlightClick: (id: string | null) => void;
}

export const HighlightLayer: React.FC<HighlightLayerProps> = ({
  highlights,
  currentPage,
  selectedHighlightId,
  onHighlightClick
}) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {highlights
        .filter(h => h.pageNumber === currentPage)
        .map(highlight => (
          <div
            key={highlight.id}
            className="highlight-area"
            style={{
              top: highlight.position.top,
              left: highlight.position.left,
              width: highlight.position.width,
              height: highlight.position.height,
              backgroundColor: `${highlight.color}80`, // 50% opacity
              boxShadow: selectedHighlightId === highlight.id ? '0 0 0 2px #000' : 'none'
            }}
            onClick={() => onHighlightClick(
              selectedHighlightId === highlight.id ? null : highlight.id
            )}
          />
        ))}
    </div>
  );
};
