
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ColorSelectionPopupProps {
  selectedHighlightId: string;
  onUpdateHighlight: (id: string, color: string) => void;
}

const COLOR_OPTIONS = [
  { value: '#FFFF00', label: 'Yellow' },
  { value: '#90EE90', label: 'Light Green' },
  { value: '#ADD8E6', label: 'Light Blue' },
  { value: '#FFB6C1', label: 'Light Pink' },
  { value: '#FFA500', label: 'Orange' },
];

export const ColorSelectionPopup: React.FC<ColorSelectionPopupProps> = ({
  selectedHighlightId,
  onUpdateHighlight,
}) => {
  return (
    <div className="color-popup" role="dialog" aria-label="Highlight color selection">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium">Select highlight color</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0"
          onClick={() => onUpdateHighlight(selectedHighlightId, '')}
          aria-label="Close color picker"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex gap-2">
        {COLOR_OPTIONS.map(color => (
          <button
            key={color.value}
            className="color-swatch"
            style={{ backgroundColor: color.value }}
            onClick={() => onUpdateHighlight(selectedHighlightId, color.value)}
            aria-label={`Select ${color.label} color`}
            title={color.label}
          />
        ))}
      </div>
    </div>
  );
};
