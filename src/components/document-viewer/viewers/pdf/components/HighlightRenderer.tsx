
import React, { useState } from 'react';
import { HighlightArea } from '../hooks/usePdfViewerState';

interface HighlightRendererProps {
  pageIndex: number;
  areas?: HighlightArea[];
  onMouseEnter?: (area: HighlightArea) => void;
  onMouseLeave?: (area: HighlightArea) => void;
}

export const HighlightRenderer: React.FC<HighlightRendererProps> = ({
  pageIndex,
  areas,
  onMouseEnter,
  onMouseLeave
}) => {
  const [hoveredHighlight, setHoveredHighlight] = useState<string | null>(null);

  const handleMouseEnter = (highlight: HighlightArea) => {
    setHoveredHighlight(highlight.id);
    if (onMouseEnter) onMouseEnter(highlight);
  };

  const handleMouseLeave = (highlight: HighlightArea) => {
    setHoveredHighlight(null);
    if (onMouseLeave) onMouseLeave(highlight);
  };

  return (
    <div>
      {areas && Array.isArray(areas) && areas
        .filter(area => area.pageIndex === pageIndex)
        .map((highlight) => {
          const highlightColor = highlight.selectedColor;
          const isHighlighterMode = highlight.isHighlighter;
          const isHovered = hoveredHighlight === highlight.id;
          
          return (
            <div
              key={highlight.id}
              style={{
                background: isHighlighterMode 
                  ? `${highlightColor}${isHovered ? 'C0' : '80'}` // More opaque when hovered
                  : 'transparent',
                border: isHighlighterMode 
                  ? 'none' 
                  : `${isHovered ? 3 : 2}px solid ${highlightColor}`,
                borderRadius: '4px',
                position: 'absolute',
                left: `${highlight.left}px`,
                top: `${highlight.top}px`,
                height: `${highlight.height}px`,
                width: `${highlight.width}px`,
                zIndex: isHovered ? 10 : 1,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={() => handleMouseEnter(highlight)}
              onMouseLeave={() => handleMouseLeave(highlight)}
              aria-label={`Highlight created with ${highlight.selectedColor} color`}
            />
          );
        })}
    </div>
  );
};
