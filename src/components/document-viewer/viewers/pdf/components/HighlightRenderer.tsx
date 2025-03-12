
import React from 'react';
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
  return (
    <div>
      {areas && Array.isArray(areas) && areas
        .filter(area => area.pageIndex === pageIndex)
        .map((highlight) => {
          const highlightColor = highlight.selectedColor;
          const isHighlighterMode = highlight.isHighlighter;
          
          return (
            <div
              key={highlight.id}
              style={{
                background: isHighlighterMode ? `${highlightColor}80` : 'transparent',
                border: isHighlighterMode ? 'none' : `2px solid ${highlightColor}`,
                borderRadius: '4px',
                position: 'absolute',
                left: `${highlight.left}px`,
                top: `${highlight.top}px`,
                height: `${highlight.height}px`,
                width: `${highlight.width}px`,
                zIndex: 1,
              }}
              onMouseEnter={() => onMouseEnter && onMouseEnter(highlight)}
            />
          );
        })}
    </div>
  );
};

