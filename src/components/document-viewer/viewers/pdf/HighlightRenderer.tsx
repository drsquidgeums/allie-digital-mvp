
import React from 'react';
import { Highlight } from 'react-pdf-highlighter';
import { IHighlight } from 'react-pdf-highlighter';

interface HighlightRendererProps {
  highlight: IHighlight;
  index: number;
  isScrolledTo: boolean;
  selectedColor: string;
  isSelected: boolean;
  onHighlightClick: (highlight: IHighlight) => void;
  onHighlightMouseOver: (highlight: IHighlight) => void;
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
  const highlightColor = isSelected ? "rgba(255, 226, 143, 1)" : selectedColor || "rgba(255, 235, 59, 0.5)";
  
  // Create the proper position format from the highlight position
  const position = {
    boundingRect: {
      ...highlight.position.boundingRect,
      left: highlight.position.boundingRect.x || 0,
      top: highlight.position.boundingRect.y || 0,
      right: (highlight.position.boundingRect.x || 0) + (highlight.position.boundingRect.width || 0),
      bottom: (highlight.position.boundingRect.y || 0) + (highlight.position.boundingRect.height || 0)
    },
    rects: highlight.position.rects.map(rect => ({
      ...rect,
      left: rect.x || 0,
      top: rect.y || 0,
      right: (rect.x || 0) + (rect.width || 0),
      bottom: (rect.y || 0) + (rect.height || 0)
    })),
    pageNumber: highlight.position.pageNumber
  };
  
  return (
    <Highlight
      isScrolledTo={isScrolledTo}
      position={position}
      comment={highlight.comment}
      key={index}
      onClick={() => onHighlightClick(highlight)}
      onMouseOver={() => onHighlightMouseOver(highlight)}
      onMouseOut={onHighlightMouseOut}
    />
  );
};
