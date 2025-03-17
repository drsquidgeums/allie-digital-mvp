
import React from 'react';
import { Highlight } from 'react-pdf-highlighter';
import { IHighlight } from 'react-pdf-highlighter';

interface ExtendedHighlight extends IHighlight {
  color?: string;
}

interface HighlightRendererProps {
  highlight: ExtendedHighlight;
  index: number;
  isScrolledTo: boolean;
  selectedColor: string;
  isSelected: boolean;
  onHighlightClick: (highlight: ExtendedHighlight) => void;
  onHighlightMouseOver: (highlight: ExtendedHighlight) => void;
  onHighlightMouseOut: () => void;
}

export const HighlightRenderer: React.FC<HighlightRendererProps> = ({
  highlight,
  index,
  isScrolledTo,
  selectedColor,
  isSelected,
  onHighlightClick,
  onHighlightMouseOver,
  onHighlightMouseOut
}) => {
  // Use the highlight's color if available, otherwise use the selected color or default yellow
  const highlightColor = highlight.color || (isSelected ? "rgba(255, 226, 143, 1)" : selectedColor || "rgba(255, 235, 59, 0.5)");
  
  // Make sure the position object has all required properties
  const ensureCompletePosition = (highlight: ExtendedHighlight) => {
    // Deep clone the position to avoid modifying the original
    const position = JSON.parse(JSON.stringify(highlight.position));
    
    // Ensure boundingRect has all required properties
    if (position.boundingRect) {
      position.boundingRect = {
        ...position.boundingRect,
        left: position.boundingRect.left || 0,
        top: position.boundingRect.top || 0,
        right: position.boundingRect.right || 
              (position.boundingRect.left || 0) + (position.boundingRect.width || 0),
        bottom: position.boundingRect.bottom || 
               (position.boundingRect.top || 0) + (position.boundingRect.height || 0),
      };
    }
    
    // Ensure each rect in rects array has all required properties
    if (position.rects && Array.isArray(position.rects)) {
      position.rects = position.rects.map(rect => ({
        ...rect,
        left: rect.left || 0,
        top: rect.top || 0,
        right: rect.right || (rect.left || 0) + (rect.width || 0),
        bottom: rect.bottom || (rect.top || 0) + (rect.height || 0),
      }));
    }
    
    return position;
  };
  
  const completePosition = ensureCompletePosition(highlight);
  
  // Create custom class to apply style as className instead of style prop
  const highlightClass = `pdf-highlight-${index}`;
  
  // Add a dynamic style tag to the document head
  React.useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      .${highlightClass} .Highlight__parts {
        background-color: ${highlightColor} !important;
      }
    `;
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, [highlightClass, highlightColor]);
  
  return (
    <Highlight
      isScrolledTo={isScrolledTo}
      position={completePosition}
      comment={highlight.comment}
      onClick={() => onHighlightClick(highlight)}
      onMouseOver={() => onHighlightMouseOver(highlight)}
      onMouseOut={onHighlightMouseOut}
      className={highlightClass}
    />
  );
};
