import React from 'react';
import { ShapeButton } from './ShapeButton';
import { LucideIcon } from 'lucide-react';

interface Shape {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
}

interface ShapeGroupProps {
  shapes: Shape[];
  onShapeSelect: (shape: string, label: string) => void;
}

export const ShapeGroup = ({ shapes, onShapeSelect }: ShapeGroupProps) => {
  return (
    <div className="flex items-center space-x-1">
      {shapes.map((shape) => (
        <ShapeButton
          key={shape.id}
          {...shape}
          onClick={() => onShapeSelect(shape.id, shape.label)}
        />
      ))}
    </div>
  );
};