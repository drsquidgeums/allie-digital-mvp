import React from 'react';
import { ColorOption } from '../types';
import { ColorPicker } from '../../ColorPicker';
import { toast } from "sonner";

interface ColorSelectorProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  colorOptions: ColorOption[];
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  selectedColor,
  setSelectedColor,
  customColor,
  setCustomColor,
  colorOptions,
}) => {
  const handleColorKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const select = e.target as HTMLSelectElement;
      setSelectedColor(select.value);
      toast(`Color changed to ${select.options[select.selectedIndex].text}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedColor}
        onChange={(e) => {
          setSelectedColor(e.target.value);
          toast(`Color changed to ${e.target.options[e.target.selectedIndex].text}`);
        }}
        onKeyDown={handleColorKeyDown}
        className="h-9 px-3 py-1 rounded-md border border-input bg-background text-foreground text-sm pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Select node color"
      >
        {colorOptions.map((color) => (
          <option key={color.value} value={color.value}>
            {color.label}
          </option>
        ))}
      </select>
      {selectedColor === 'custom' && (
        <ColorPicker
          label="Custom color"
          value={customColor}
          onChange={(color) => {
            setCustomColor(color);
            toast("Custom color updated");
          }}
        />
      )}
    </div>
  );
};