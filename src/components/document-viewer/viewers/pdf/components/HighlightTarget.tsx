
import React from 'react';
import { RenderHighlightTargetProps } from '@react-pdf-viewer/highlight';
import { HighlightArea } from '../hooks/usePdfViewerState';

interface HighlightTargetProps extends RenderHighlightTargetProps {
  selectedColor: string;
  isHighlighter: boolean;
  onHighlightCreated: (highlight: HighlightArea) => void;
}

export const HighlightTarget: React.FC<HighlightTargetProps> = ({
  selectionRegion,
  toggle,
  selectedColor,
  isHighlighter,
  onHighlightCreated
}) => {
  const handleClick = () => {
    toggle();
    
    if (selectionRegion) {
      const newHighlight: HighlightArea = {
        id: `highlight-${Date.now()}`,
        pageIndex: selectionRegion.pageIndex,
        left: selectionRegion.left,
        top: selectionRegion.top,
        width: selectionRegion.width,
        height: selectionRegion.height,
        selectedColor,
        isHighlighter
      };
      
      onHighlightCreated(newHighlight);
      console.log("Created highlight with color:", selectedColor, newHighlight);
    }
  };

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid rgba(0, 0, 0, 0.3)',
        borderRadius: '2px',
        padding: '8px',
        position: 'absolute',
        left: `${selectionRegion.left}px`,
        top: `${selectionRegion.top + selectionRegion.height}px`,
        zIndex: 1,
      }}
    >
      <div>
        <button
          style={{
            background: selectedColor,
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            padding: '8px',
            color: isHighlighter ? 'black' : 'white',
          }}
          onClick={handleClick}
        >
          {isHighlighter ? 'Highlight' : 'Annotate'}
        </button>
      </div>
    </div>
  );
};

