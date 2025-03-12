
import React, { useState } from 'react';
import { HighlightArea } from '../hooks/usePdfViewerState';

interface HighlightRendererProps {
  pageIndex: number;
  areas?: HighlightArea[];
  onMouseEnter?: (area: HighlightArea) => void;
  onMouseLeave?: (area: HighlightArea) => void;
  onHighlightClick?: (area: HighlightArea) => void;
}

export const HighlightRenderer: React.FC<HighlightRendererProps> = ({
  pageIndex,
  areas,
  onMouseEnter,
  onMouseLeave,
  onHighlightClick
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

  const handleClick = (highlight: HighlightArea) => {
    if (onHighlightClick) onHighlightClick(highlight);
  };

  if (!areas || !Array.isArray(areas) || areas.length === 0) {
    return null;
  }

  return (
    <div className="highlight-container">
      {areas
        .filter(area => area.pageIndex === pageIndex)
        .map((highlight) => {
          const highlightColor = highlight.selectedColor || '#FFFF00';
          const isHighlighterMode = highlight.isHighlighter !== false;
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
                zIndex: isHovered ? 10 : 5,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                pointerEvents: 'all',
              }}
              onMouseEnter={() => handleMouseEnter(highlight)}
              onMouseLeave={() => handleMouseLeave(highlight)}
              onClick={() => handleClick(highlight)}
              aria-label={`Highlight created with ${highlight.selectedColor} color`}
              data-highlight-id={highlight.id}
            />
          );
        })}
    </div>
  );
};
