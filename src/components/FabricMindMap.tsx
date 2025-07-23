import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Circle, Rect, Text, Group, FabricObject } from 'fabric';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Download, Trash2, Undo, Redo, Square, Circle as CircleIcon, Type } from "lucide-react";
import { toast } from "sonner";

interface FabricMindMapProps {
  className?: string;
}

export const FabricMindMap: React.FC<FabricMindMapProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#9b87f5");
  const [activeTool, setActiveTool] = useState<"select" | "rectangle" | "circle" | "text">("select");
  const [newNodeText, setNewNodeText] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "hsl(var(--background))",
    });

    setFabricCanvas(canvas);
    
    // Save initial state
    const initialState = JSON.stringify(canvas.toJSON());
    setHistory([initialState]);
    setHistoryStep(0);

    // Add canvas event listeners
    canvas.on('object:added', () => saveState(canvas));
    canvas.on('object:removed', () => saveState(canvas));
    canvas.on('object:modified', () => saveState(canvas));

    toast.success("Mind map ready! Click tools to add elements.");

    return () => {
      canvas.dispose();
    };
  }, []);

  const saveState = useCallback((canvas: FabricCanvas) => {
    const state = JSON.stringify(canvas.toJSON());
    setHistory(prev => {
      const newHistory = prev.slice(0, historyStep + 1);
      newHistory.push(state);
      return newHistory.slice(-20); // Keep last 20 states
    });
    setHistoryStep(prev => Math.min(prev + 1, 19));
  }, [historyStep]);

  const handleToolClick = (tool: typeof activeTool) => {
    if (!fabricCanvas) return;
    
    setActiveTool(tool);

    if (tool === "rectangle") {
      const rect = new Rect({
        left: 100 + Math.random() * 200,
        top: 100 + Math.random() * 200,
        fill: activeColor,
        width: 120,
        height: 80,
        rx: 8,
        ry: 8,
        stroke: "hsl(var(--border))",
        strokeWidth: 2,
      });
      fabricCanvas.add(rect);
      fabricCanvas.setActiveObject(rect);
      toast.success("Rectangle added!");
    } else if (tool === "circle") {
      const circle = new Circle({
        left: 100 + Math.random() * 200,
        top: 100 + Math.random() * 200,
        fill: activeColor,
        radius: 50,
        stroke: "hsl(var(--border))",
        strokeWidth: 2,
      });
      fabricCanvas.add(circle);
      fabricCanvas.setActiveObject(circle);
      toast.success("Circle added!");
    } else if (tool === "text") {
      if (newNodeText.trim()) {
        const text = new Text(newNodeText, {
          left: 100 + Math.random() * 200,
          top: 100 + Math.random() * 200,
          fill: "hsl(var(--foreground))",
          fontSize: 16,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: '500',
        });
        fabricCanvas.add(text);
        fabricCanvas.setActiveObject(text);
        setNewNodeText("");
        toast.success("Text node added!");
      } else {
        toast.error("Please enter text first!");
      }
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "hsl(var(--background))";
    fabricCanvas.renderAll();
    toast.success("Canvas cleared!");
  };

  const handleUndo = () => {
    if (!fabricCanvas || historyStep <= 0) return;
    
    const previousState = history[historyStep - 1];
    fabricCanvas.loadFromJSON(previousState, () => {
      fabricCanvas.renderAll();
      setHistoryStep(prev => prev - 1);
      toast.success("Undone!");
    });
  };

  const handleRedo = () => {
    if (!fabricCanvas || historyStep >= history.length - 1) return;
    
    const nextState = history[historyStep + 1];
    fabricCanvas.loadFromJSON(nextState, () => {
      fabricCanvas.renderAll();
      setHistoryStep(prev => prev + 1);
      toast.success("Redone!");
    });
  };

  const handleExport = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });
    
    const link = document.createElement('a');
    link.download = 'mindmap.png';
    link.href = dataURL;
    link.click();
    toast.success("Mind map exported!");
  };

  const colors = [
    "#9b87f5", "#8b5cf6", "#a855f7", "#c084fc", "#d946ef",
    "#ec4899", "#f43f5e", "#ef4444", "#f97316", "#f59e0b",
    "#eab308", "#84cc16", "#22c55e", "#10b981", "#14b8a6",
    "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6"
  ];

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Toolbar */}
      <Card className="flex items-center gap-4 p-4 mb-4 bg-background/80 backdrop-blur-sm">
        {/* History Controls */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                disabled={historyStep <= 0}
                className="h-8 w-8 p-0"
              >
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRedo}
                disabled={historyStep >= history.length - 1}
                className="h-8 w-8 p-0"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Tools */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeTool === "rectangle" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleToolClick("rectangle")}
                className="h-8 w-8 p-0"
              >
                <Square className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Rectangle</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeTool === "circle" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleToolClick("circle")}
                className="h-8 w-8 p-0"
              >
                <CircleIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Circle</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeTool === "text" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleToolClick("text")}
                className="h-8 w-8 p-0"
              >
                <Type className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Text</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Text Input */}
        <Input
          placeholder="Enter text for nodes..."
          value={newNodeText}
          onChange={(e) => setNewNodeText(e.target.value)}
          className="w-48"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleToolClick("text");
            }
          }}
        />

        <div className="w-px h-6 bg-border" />

        {/* Color Picker */}
        <div className="flex items-center gap-1">
          {colors.slice(0, 8).map((color) => (
            <button
              key={color}
              onClick={() => setActiveColor(color)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                activeColor === color ? 'border-foreground scale-110' : 'border-border hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export PNG</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear Canvas</TooltipContent>
          </Tooltip>
        </div>
      </Card>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center bg-background rounded-lg border overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="max-w-full max-h-full"
          style={{ backgroundColor: "hsl(var(--background))" }}
        />
      </div>
    </div>
  );
};