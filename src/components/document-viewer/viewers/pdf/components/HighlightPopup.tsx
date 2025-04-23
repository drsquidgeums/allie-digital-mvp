
import React from 'react';
import { Button } from '@/components/ui/button';

interface HighlightPopupProps {
  selectedHighlightId: string;
  onColorChange: (id: string, color: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const HighlightPopup: React.FC<HighlightPopupProps> = ({
  selectedHighlightId,
  onColorChange,
  onDelete,
  onClose
}) => {
  const colors = ["#ffeb3b", "#ff9800", "#f44336", "#4caf50", "#2196f3", "#9c27b0"];
  
  const colorNames = {
    "#ffeb3b": "Yellow",
    "#ff9800": "Orange",
    "#f44336": "Red",
    "#4caf50": "Green",
    "#2196f3": "Blue",
    "#9c27b0": "Purple"
  };

  return (
    <div 
      className="absolute bottom-4 right-4 bg-white p-4 rounded shadow-lg z-50"
      role="dialog"
      aria-label="Highlight Options"
    >
      <h3 className="text-sm font-medium mb-2" id="highlight-options-title">Highlight Options</h3>
      <div 
        className="flex flex-wrap gap-2 mb-3"
        role="radiogroup"
        aria-labelledby="highlight-color-selection"
      >
        <span id="highlight-color-selection" className="sr-only">Select highlight color</span>
        {colors.map(color => (
          <button 
            key={color} 
            style={{
              backgroundColor: color,
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: "1px solid #ccc"
            }}
            onClick={() => onColorChange(selectedHighlightId, color)}
            aria-label={`${colorNames[color as keyof typeof colorNames] || color} color`}
            role="radio"
            aria-checked="false"
          />
        ))}
      </div>
      <div className="flex justify-between">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(selectedHighlightId)}
          aria-label="Delete highlight"
        >
          Delete
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          aria-label="Close highlight options"
        >
          Close
        </Button>
      </div>
    </div>
  );
};
