
import React from 'react';

interface ColorSelectionPopupProps {
  selectedHighlightId: string;
  onUpdateHighlight: (id: string, color: string) => void;
}

export const ColorSelectionPopup: React.FC<ColorSelectionPopupProps> = ({
  selectedHighlightId,
  onUpdateHighlight
}) => {
  const colorOptions = [
    "#FFFF00", "#FF9900", "#FF0000", "#00FF00", 
    "#00FFFF", "#0000FF", "#9b87f5", "#FEC6A1"
  ];

  return (
    <div className="absolute bottom-4 right-4 bg-white p-4 rounded shadow-lg z-50">
      <h3 className="text-sm font-medium mb-2">Highlight Color</h3>
      <div className="flex flex-wrap gap-2">
        {colorOptions.map(color => (
          <button 
            key={color} 
            style={{
              backgroundColor: color,
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: "1px solid #ccc"
            }}
            onClick={() => onUpdateHighlight(selectedHighlightId, color)}
          />
        ))}
      </div>
    </div>
  );
};
