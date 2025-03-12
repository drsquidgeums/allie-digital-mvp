
import React from 'react';
import { RenderHighlightTargetProps } from '@react-pdf-viewer/highlight';
import { HighlightArea } from '../hooks/usePdfViewerState';
import { Highlighter, Palette, PenLine } from 'lucide-react';

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
  const colors = [
    "#FFFF00", // Yellow
    "#FF9900", // Orange
    "#FF0000", // Red
    "#00FF00", // Green
    "#00FFFF", // Cyan
    "#0000FF", // Blue
    "#9b87f5", // Primary Purple
    "#FEC6A1", // Soft Orange
  ];
  
  const handleHighlight = (color: string, isHighlighterMode: boolean) => {
    toggle();
    
    if (selectionRegion) {
      const newHighlight: HighlightArea = {
        id: `highlight-${Date.now()}`,
        pageIndex: selectionRegion.pageIndex,
        left: selectionRegion.left,
        top: selectionRegion.top,
        width: selectionRegion.width,
        height: selectionRegion.height,
        selectedColor: color,
        isHighlighter: isHighlighterMode
      };
      
      onHighlightCreated(newHighlight);
      console.log("Created highlight with color:", color, newHighlight);
    }
  };

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid rgba(0, 0, 0, 0.3)',
        borderRadius: '4px',
        padding: '8px',
        position: 'absolute',
        left: `${selectionRegion.left}px`,
        top: `${selectionRegion.top + selectionRegion.height}px`,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <Highlighter className="w-4 h-4" />
          <span className="text-xs font-medium">Highlight</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {colors.map(color => (
            <button
              key={`highlighter-${color}`}
              className="w-6 h-6 rounded-full border border-gray-300 transition-transform hover:scale-110"
              style={{ backgroundColor: color }}
              onClick={() => handleHighlight(color, true)}
              aria-label={`Highlight with ${color} color`}
            />
          ))}
        </div>
        
        <div className="flex items-center gap-2 mb-1">
          <PenLine className="w-4 h-4" />
          <span className="text-xs font-medium">Underline</span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {colors.map(color => (
            <button
              key={`underline-${color}`}
              className="w-6 h-6 rounded-full border border-gray-300 transition-transform hover:scale-110"
              style={{ backgroundColor: color }}
              onClick={() => handleHighlight(color, false)}
              aria-label={`Underline with ${color} color`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
