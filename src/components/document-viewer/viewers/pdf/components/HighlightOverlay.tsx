
import React from 'react';

interface Highlight {
  id: string;
  position: DOMRect;
  color: string;
  page: number;
}

interface HighlightOverlayProps {
  highlights: Highlight[];
  pageNumber: number;
}

export const HighlightOverlay: React.FC<HighlightOverlayProps> = ({
  highlights,
  pageNumber
}) => {
  // Filter highlights for current page
  const pageHighlights = highlights.filter(h => h.page === pageNumber);
  
  if (pageHighlights.length === 0) return null;
  
  return (
    <div 
      className="absolute top-0 left-0 w-full h-full pointer-events-none" 
      aria-hidden="true"
    >
      {pageHighlights.map(highlight => (
        <div
          key={highlight.id}
          style={{
            position: 'absolute',
            left: `${highlight.position.left}px`,
            top: `${highlight.position.top}px`,
            width: `${highlight.position.width}px`,
            height: `${highlight.position.height}px`,
            backgroundColor: `${highlight.color}80`, // 50% opacity
            pointerEvents: 'none',
            zIndex: 2,
          }}
          data-highlight-id={highlight.id}
        />
      ))}
    </div>
  );
};
