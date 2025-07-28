
import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Shape {
  id: number;
  x: number;
  y: number;
  type: 'circle' | 'rect' | 'text';
  color: string;
  text?: string;
}

export const MindMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shapes, setShapes] = useState<Shape[]>([
    { id: 1, x: 100, y: 100, type: 'circle', color: '#9b87f5' },
    { id: 2, x: 300, y: 150, type: 'rect', color: '#0ea5e9' },
    { id: 3, x: 200, y: 250, type: 'text', color: '#000000', text: 'Mind Map Node' }
  ]);

  const drawShapes = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw shapes
    shapes.forEach(shape => {
      ctx.fillStyle = shape.color;
      
      if (shape.type === 'circle') {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, 30, 0, 2 * Math.PI);
        ctx.fill();
      } else if (shape.type === 'rect') {
        ctx.fillRect(shape.x, shape.y, 60, 40);
      } else if (shape.type === 'text' && shape.text) {
        ctx.font = '16px Arial';
        ctx.fillText(shape.text, shape.x, shape.y);
      }
    });
  };

  useEffect(() => {
    drawShapes();
  }, [shapes]);

  const addCircle = () => {
    const newShape: Shape = {
      id: Date.now(),
      x: Math.random() * 400 + 50,
      y: Math.random() * 200 + 50,
      type: 'circle',
      color: '#9b87f5'
    };
    setShapes(prev => [...prev, newShape]);
    toast.success("Circle added!");
  };

  const addRect = () => {
    const newShape: Shape = {
      id: Date.now(),
      x: Math.random() * 400 + 50,
      y: Math.random() * 200 + 50,
      type: 'rect',
      color: '#0ea5e9'
    };
    setShapes(prev => [...prev, newShape]);
    toast.success("Rectangle added!");
  };

  const clearCanvas = () => {
    setShapes([]);
    toast.success("Canvas cleared!");
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">HTML5 Canvas Mind Map</h2>
        <div className="flex gap-2 mt-2">
          <Button onClick={addCircle}>Add Circle</Button>
          <Button onClick={addRect}>Add Rectangle</Button>
          <Button onClick={clearCanvas} variant="outline">Clear</Button>
        </div>
      </div>
      <div className="flex-1 border border-border rounded-lg overflow-hidden bg-background">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400}
          className="bg-white"
        />
      </div>
    </div>
  );
};
