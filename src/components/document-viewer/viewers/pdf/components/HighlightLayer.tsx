
import React from 'react';

export interface Highlight {
  id: string;
  position: {
    pageNumber: number;
    boundingRect: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
      height: number;
    };
  };
  content: {
    text?: string;
  };
  color?: string;
}

interface HighlightLayerProps {
  highlights: Highlight[];
  selectedHighlightId: string | null;
  onHighlightClick: (id: string) => void;
}

export const HighlightLayer: React.FC<HighlightLayerProps> = ({
  highlights,
  selectedHighlightId,
  onHighlightClick
}) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full">
      {highlights.map(highlight => (
        <div
          key={highlight.id}
          className="highlight-item"
          style={{
            position: 'absolute',
            left: `${highlight.position.boundingRect.x1}px`,
            top: `${highlight.position.boundingRect.y1}px`,
            width: `${highlight.position.boundingRect.width}px`,
            height: `${highlight.position.boundingRect.height}px`,
            backgroundColor: `${highlight.color || '#ffeb3b'}80`, // 50% opacity
            border: selectedHighlightId === highlight.id ? '2px solid #000' : 'none',
            cursor: 'pointer',
            zIndex: 2,
          }}
          onClick={() => onHighlightClick(highlight.id)}
          data-highlight-id={highlight.id}
        />
      ))}
    </div>
  );
};
