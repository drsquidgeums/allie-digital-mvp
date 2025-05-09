
import React from 'react';
import { Button } from '@/components/ui/button';
import { PdfHighlight } from '../hooks/usePdfHighlights';

interface HighlightOptionsPopupProps {
  selectedHighlight: PdfHighlight;
  onColorUpdate: (id: string, color: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const HighlightOptionsPopup: React.FC<HighlightOptionsPopupProps> = ({
  selectedHighlight,
  onColorUpdate,
  onDelete,
  onClose
}) => {
  if (!selectedHighlight) return null;

  const colorOptions = ["#ffeb3b", "#ff9800", "#f44336", "#4caf50", "#2196f3", "#9c27b0"];

  return (
    <div className="absolute bottom-4 right-4 bg-white p-4 rounded shadow-lg z-50">
      <h3 className="text-sm font-medium mb-2">Highlight Options</h3>
      <div className="flex flex-wrap gap-2">
        {colorOptions.map(color => (
          <button 
            key={color} 
            type="button"
            style={{
              backgroundColor: color,
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: color === selectedHighlight.color ? "2px solid black" : "1px solid #ccc"
            }}
            onClick={() => onColorUpdate(selectedHighlight.id, color)}
            aria-label={`Change highlight color to ${color}`}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(selectedHighlight.id)}
        >
          Delete
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
};
