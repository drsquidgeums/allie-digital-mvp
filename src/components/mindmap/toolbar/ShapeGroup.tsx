
import React from 'react';
import { ShapeButton } from './ShapeButton';
import { LucideIcon } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { ShapeConfig } from '../types';

interface ShapeGroupProps {
  shapes: ShapeConfig[];
  onShapeSelect: (shape: string, label?: string) => void;
}

export const ShapeGroup = ({ shapes, onShapeSelect }: ShapeGroupProps) => {
  // Add safety check to prevent error when shapes is undefined
  if (!shapes || !Array.isArray(shapes)) {
    console.warn('ShapeGroup received invalid shapes prop', shapes);
    return null;
  }

  return (
    <Card className="flex items-center space-x-1 p-1 rounded-lg border border-border/40 bg-background/50 shadow-sm">
      {shapes.map((shape) => (
        <ShapeButton
          key={shape.id}
          id={shape.id}
          icon={shape.icon}
          label={shape.label}
          description={shape.description || shape.label}
          onClick={() => onShapeSelect(shape.id, '')}
        />
      ))}
    </Card>
  );
};
