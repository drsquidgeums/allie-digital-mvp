
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

  return (
    <div className="absolute bottom-4 right-4 bg-white p-4 rounded shadow-lg z-50">
      <h3 className="text-sm font-medium mb-2">Highlight Options</h3>
      <div className="flex flex-wrap gap-2 mb-3">
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
          />
        ))}
      </div>
      <div className="flex justify-between">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(selectedHighlightId)}
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
