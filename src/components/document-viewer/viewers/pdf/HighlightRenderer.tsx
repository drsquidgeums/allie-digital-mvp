
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
  
  return (
    <Highlight
      isScrolledTo={isScrolledTo}
      position={highlight.position}
      comment={highlight.comment}
      key={index}
      onClick={() => onHighlightClick(highlight)}
      onMouseOver={() => onHighlightMouseOver(highlight)}
      onMouseOut={onHighlightMouseOut}
    />
  );
};
