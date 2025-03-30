
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
  type: 'shape' | 'text';
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  selectedColor,
  setSelectedColor,
  customColor,
  setCustomColor,
  colorOptions,
  label = "Color",
  type
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
        <SelectTrigger className={`w-[150px] h-9 flex items-center gap-2 ${type === 'shape' ? 'border-primary/30' : 'border-secondary/30'}`}>
          <span className={`w-3 h-3 rounded-full inline-block mr-1 ${selectedColor === 'custom' ? '' : ''}`} 
                style={{ backgroundColor: selectedColor === 'custom' ? customColor : (selectedColor !== 'auto' ? selectedColor : '#888888') }}></span>
          <SelectValue placeholder={type === 'shape' ? "Shape color" : "Text color"} />
        </SelectTrigger>
        <SelectContent>
          {colorOptions.map((color) => (
            <SelectItem 
              key={color.value} 
              value={color.value}
              className="flex items-center gap-2"
            >
              {color.value !== 'custom' && color.value !== 'auto' && (
                <div 
                  className="w-3 h-3 rounded-full inline-block mr-2" 
                  style={{ backgroundColor: color.value }} 
                />
              )}
              {color.value === 'auto' && (
                <div 
                  className="w-3 h-3 rounded-full inline-block mr-2 bg-gradient-to-r from-primary to-secondary" 
                />
              )}
              {color.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedColor === 'custom' && (
        <ColorPicker
          label={`Pick custom ${type} color`}
          value={customColor}
          onChange={(color) => {
            setCustomColor(color);
            toast(`Custom ${type} color updated`);
          }}
        />
      )}
    </div>
  );
};
