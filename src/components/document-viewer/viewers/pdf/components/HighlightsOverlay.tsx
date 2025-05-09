
import React from 'react';

interface Highlight {
  id: string;
  position: {
    pageNumber: number;
    boundingRect: DOMRect;
    rects: DOMRect[];
  };
  color: string;
  content: {
    text: string;
  };
}

interface HighlightsOverlayProps {
  highlights: Highlight[];
  pageNumber: number;
  onSelectHighlight: (id: string) => void;
  selectedHighlightId: string | null;
}

export const HighlightsOverlay: React.FC<HighlightsOverlayProps> = ({
  highlights,
  pageNumber,
  onSelectHighlight,
  selectedHighlightId
}) => {
  // Filter highlights for the current page
  const pageHighlights = highlights.filter(
    highlight => highlight.position.pageNumber === pageNumber
  );
  
  if (pageHighlights.length === 0) {
    return null;
  }
  
  return (
    <div className="highlight-layer">
      {pageHighlights.map(highlight => (
        <div key={highlight.id}>
          {highlight.position.rects.map((rect, index) => (
            <div
              key={`${highlight.id}-${index}`}
              className={`highlight-element ${selectedHighlightId === highlight.id ? 'selected' : ''}`}
              style={{
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
                backgroundColor: hexToRgba(highlight.color, 0.4)
              }}
              onClick={() => onSelectHighlight(highlight.id)}
              title={highlight.content.text}
              role="button"
              aria-pressed={selectedHighlightId === highlight.id}
              tabIndex={0}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// Helper function to convert hex color to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  
  // Parse r, g, b values
  let r = 0, g = 0, b = 0;
  if (hex.length === 3) {
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
