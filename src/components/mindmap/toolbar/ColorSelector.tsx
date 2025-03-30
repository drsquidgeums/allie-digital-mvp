
import React from 'react';
import { ColorOption } from '../types';
import { ColorPicker } from '../../ColorPicker';
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ColorSelectorProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  colorOptions: ColorOption[];
  label?: string;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  selectedColor,
  setSelectedColor,
  customColor,
  setCustomColor,
  colorOptions,
  label = "Color"
}) => {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedColor}
        onValueChange={(value) => {
          setSelectedColor(value);
          toast(`${label} changed to ${colorOptions.find(c => c.value === value)?.label || 'custom'}`);
        }}
      >
        <SelectTrigger className="w-[120px] h-9">
          <SelectValue placeholder="Select color" />
        </SelectTrigger>
        <SelectContent>
          {colorOptions.map((color) => (
            <SelectItem 
              key={color.value} 
              value={color.value}
              className="flex items-center gap-2"
            >
              {color.value !== 'custom' && (
                <div 
                  className="w-3 h-3 rounded-full inline-block mr-2" 
                  style={{ backgroundColor: color.value }} 
                />
              )}
              {color.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedColor === 'custom' && (
        <ColorPicker
          label="Pick custom color"
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
