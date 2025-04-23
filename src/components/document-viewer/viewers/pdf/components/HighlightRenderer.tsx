
import React from 'react';
import { Highlight } from 'react-pdf-highlighter';
import { PdfHighlight } from '../hooks/usePdfHighlights';
import { convertPosition } from '../utils/highlightUtils';

interface HighlightRendererProps {
  highlight: PdfHighlight;
  index: number;
  isScrolledTo: boolean;
  selectedColor: string;
  selectedHighlightId: string | null;
  setTip: any;
  hideTip: () => void;
  onHighlightClick: (highlight: PdfHighlight) => void;
}

export const HighlightRenderer: React.FC<HighlightRendererProps> = ({
  highlight,
  index,
  isScrolledTo,
  selectedColor,
  selectedHighlightId,
  setTip,
  hideTip,
  onHighlightClick
}) => {
  const isSelected = selectedHighlightId === highlight.id;
  const highlightColor = highlight.color || selectedColor;
  
  const highlightClass = `highlight-${index}-${highlight.id?.replace(/\W/g, '-')}`;
  
  // Create dynamic styles for this highlight
  React.useEffect(() => {
    const styleId = `highlight-style-${index}-${highlight.id}`;
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `
        .${highlightClass} .Highlight__part {
          background-color: ${highlightColor} !important;
        }
      `;
      document.head.appendChild(styleEl);
    }

    return () => {
      const styleEl = document.getElementById(styleId);
      if (styleEl) {
        document.head.removeChild(styleEl);
      }
    };
  }, [highlightClass, highlightColor, index, highlight.id]);
  
  const adaptedPosition = convertPosition(highlight.position);
  
  return (
    <div 
      className={highlightClass}
      data-testid={`highlight-${index}`}
      data-highlight-id={highlight.id}
    >
      <Highlight
        isScrolledTo={isScrolledTo}
        position={adaptedPosition}
        comment={highlight.comment}
        onClick={() => onHighlightClick(highlight)}
        onMouseOver={() => {
          if (highlight.content && highlight.content.text) {
            setTip(highlight, () => (
              <div className="highlight-tooltip bg-white p-2 rounded shadow-md">
                {highlight.content.text}
              </div>
            ));
          }
        }}
        onMouseOut={hideTip}
      />
    </div>
  );
};
