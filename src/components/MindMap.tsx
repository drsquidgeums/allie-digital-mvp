
import React, { useState } from 'react';
import { Stage, Layer, Circle, Rect, Text } from 'react-konva';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const MindMap = () => {
  console.log('MindMap component rendering - testing react-konva');
  const [shapes, setShapes] = useState([
    { id: 1, x: 100, y: 100, type: 'circle', fill: '#9b87f5' },
    { id: 2, x: 300, y: 150, type: 'rect', fill: '#0ea5e9' },
    { id: 3, x: 200, y: 250, type: 'text', text: 'Mind Map Node', fill: '#000000' }
  ]);

  const addCircle = () => {
    const newShape = {
      id: Date.now(),
      x: Math.random() * 400 + 50,
      y: Math.random() * 200 + 50,
      type: 'circle',
      fill: '#9b87f5'
    };
    setShapes([...shapes, newShape]);
    toast.success("Circle added!");
  };

  const addRect = () => {
    const newShape = {
      id: Date.now(),
      x: Math.random() * 400 + 50,
      y: Math.random() * 200 + 50,
      type: 'rect',
      fill: '#0ea5e9'
    };
    setShapes([...shapes, newShape]);
    toast.success("Rectangle added!");
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">React Konva Mind Map</h2>
        <div className="flex gap-2 mt-2">
          <Button onClick={addCircle}>Add Circle</Button>
          <Button onClick={addRect}>Add Rectangle</Button>
        </div>
      </div>
      <div className="flex-1 border border-border rounded-lg overflow-hidden bg-background">
        <Stage width={800} height={400}>
          <Layer>
            {shapes.map(shape => {
              if (shape.type === 'circle') {
                return (
                  <Circle
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    radius={30}
                    fill={shape.fill}
                    draggable
                  />
                );
              } else if (shape.type === 'rect') {
                return (
                  <Rect
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    width={60}
                    height={40}
                    fill={shape.fill}
                    draggable
                  />
                );
              } else if (shape.type === 'text') {
                return (
                  <Text
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    text={shape.text}
                    fill={shape.fill}
                    draggable
                  />
                );
              }
              return null;
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};
