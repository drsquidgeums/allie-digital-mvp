
import React from 'react';
import { ShapeButton } from './ShapeButton';
import { LucideIcon } from 'lucide-react';
import { Card } from "@/components/ui/card";

interface ShapeProps {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
}

interface ShapeGroupProps {
  shapes: ShapeProps[];
  onShapeSelect: (shape: string, label?: string) => void;
}

export const ShapeGroup = ({ shapes, onShapeSelect }: ShapeGroupProps) => {
  return (
    <Card className="flex items-center space-x-1 p-1 rounded-lg border border-border/40 bg-background/50 shadow-sm">
      {shapes.map((shape) => (
        <ShapeButton
          key={shape.id}
          id={shape.id}
          icon={shape.icon}
          label={shape.label}
          description={shape.description}
          onClick={() => onShapeSelect(shape.id, '')}
        />
      ))}
    </Card>
  );
};
