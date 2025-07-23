
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const MindMap = () => {
  console.log('MindMap component rendering - testing Fabric.js');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log('Testing Fabric.js import...');
    
    const loadFabric = async () => {
      try {
        const { Canvas, Circle } = await import('fabric');
        console.log('Fabric.js imported successfully!', { Canvas, Circle });
        
        if (canvasRef.current) {
          const canvas = new Canvas(canvasRef.current, {
            width: 800,
            height: 400,
            backgroundColor: '#ffffff',
          });
          
          console.log('Canvas created:', canvas);
          
          // Add a test circle
          const circle = new Circle({
            left: 100,
            top: 100,
            fill: '#9b87f5',
            radius: 50,
          });
          
          canvas.add(circle);
          console.log('Test circle added');
          toast.success("Fabric.js is working! You should see a purple circle.");
        }
      } catch (error) {
        console.error('Failed to import or use Fabric.js:', error);
        toast.error("Failed to load Fabric.js: " + error.message);
      }
    };
    
    loadFabric();
  }, []);

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Testing Fabric.js Mind Map</h2>
        <p className="text-sm text-muted-foreground">Check console for logs</p>
      </div>
      <div className="flex-1 border border-border rounded-lg overflow-hidden bg-background">
        <canvas ref={canvasRef} className="block" />
      </div>
    </div>
  );
};
