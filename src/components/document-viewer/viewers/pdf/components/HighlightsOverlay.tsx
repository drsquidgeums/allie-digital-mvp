
import React from 'react';
import { PdfHighlight } from '../hooks/usePdfHighlights';

interface HighlightsOverlayProps {
  highlights: PdfHighlight[];
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
  
  return (
    <div className="highlight-layer">
      {pageHighlights.map(highlight => (
        <div key={highlight.id}>
          {highlight.position.rects.map((rect, index) => {
            const { x1, y1, x2, y2, width, height } = rect;
            return (
              <div
                key={`${highlight.id}-${index}`}
                className={`highlight-element ${selectedHighlightId === highlight.id ? 'selected' : ''}`}
                style={{
                  position: 'absolute',
                  left: x1,
                  top: y1,
                  width: width || (x2 - x1),
                  height: height || (y2 - y1),
                  backgroundColor: hexToRgba(highlight.color || '#FFFF00', 0.4)
                }}
                onClick={() => onSelectHighlight(highlight.id)}
                title={highlight.content.text || ''}
                role="button"
                aria-pressed={selectedHighlightId === highlight.id}
                tabIndex={0}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default HighlightsOverlay;
