
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Palette, Type, Download, Copy, X, Undo, Pencil } from 'lucide-react';

interface ScreenshotAnnotatorProps {
  imageDataUrl: string;
  onSave: (dataUrl: string) => void;
  onCopyToClipboard: (dataUrl: string) => void;
  onClose: () => void;
}

type Tool = 'draw' | 'text' | 'none';

interface TextAnnotation {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

export const ScreenshotAnnotator: React.FC<ScreenshotAnnotatorProps> = ({
  imageDataUrl,
  onSave,
  onCopyToClipboard,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<Tool>('none');
  const [color, setColor] = useState('#ff0000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawHistory, setDrawHistory] = useState<ImageData[]>([]);
  const [textAnnotations, setTextAnnotations] = useState<TextAnnotation[]>([]);
  const [editingText, setEditingText] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#000000', '#ffffff'];

  useEffect(() => {
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!canvas || !overlayCanvas) return;

    const ctx = canvas.getContext('2d');
    const overlayCtx = overlayCanvas.getContext('2d');
    if (!ctx || !overlayCtx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas dimensions to match image
      const maxWidth = window.innerWidth * 0.8;
      const maxHeight = window.innerHeight * 0.7;
      
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      overlayCanvas.width = width;
      overlayCanvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Save initial state
      const initialState = ctx.getImageData(0, 0, width, height);
      setDrawHistory([initialState]);
      setImageLoaded(true);
    };
    img.src = imageDataUrl;
  }, [imageDataUrl]);

  const getCanvasCoordinates = (e: React.MouseEvent) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (tool === 'draw') {
      setIsDrawing(true);
      const overlayCanvas = overlayCanvasRef.current;
      const overlayCtx = overlayCanvas?.getContext('2d');
      if (overlayCtx) {
        const { x, y } = getCanvasCoordinates(e);
        overlayCtx.beginPath();
        overlayCtx.moveTo(x, y);
        overlayCtx.strokeStyle = color;
        overlayCtx.lineWidth = 3;
        overlayCtx.lineCap = 'round';
      }
    } else if (tool === 'text') {
      const { x, y } = getCanvasCoordinates(e);
      const newAnnotation: TextAnnotation = {
        id: Date.now().toString(),
        x,
        y,
        text: '',
        color
      };
      setTextAnnotations(prev => [...prev, newAnnotation]);
      setEditingText(newAnnotation.id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || tool !== 'draw') return;
    
    const overlayCanvas = overlayCanvasRef.current;
    const overlayCtx = overlayCanvas?.getContext('2d');
    if (overlayCtx) {
      const { x, y } = getCanvasCoordinates(e);
      overlayCtx.lineTo(x, y);
      overlayCtx.stroke();
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && tool === 'draw') {
      setIsDrawing(false);
      // Merge overlay to main canvas
      mergeCanvases();
    }
  };

  const mergeCanvases = () => {
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!canvas || !overlayCanvas) return;
    
    const ctx = canvas.getContext('2d');
    const overlayCtx = overlayCanvas.getContext('2d');
    if (!ctx || !overlayCtx) return;

    // Draw overlay onto main canvas
    ctx.drawImage(overlayCanvas, 0, 0);
    
    // Clear overlay
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    // Save to history
    const newState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setDrawHistory(prev => [...prev, newState]);
  };

  const handleUndo = () => {
    if (drawHistory.length <= 1) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const newHistory = [...drawHistory];
    newHistory.pop();
    setDrawHistory(newHistory);
    
    const previousState = newHistory[newHistory.length - 1];
    ctx.putImageData(previousState, 0, 0);
  };

  const updateTextAnnotation = (id: string, text: string) => {
    setTextAnnotations(prev => 
      prev.map(ann => ann.id === id ? { ...ann, text } : ann)
    );
  };

  const getFinalImage = (): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';
    
    // Create a new canvas to combine everything
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height;
    const finalCtx = finalCanvas.getContext('2d');
    if (!finalCtx) return '';
    
    // Draw the main canvas
    finalCtx.drawImage(canvas, 0, 0);
    
    // Draw text annotations
    textAnnotations.forEach(ann => {
      if (ann.text) {
        finalCtx.font = '16px sans-serif';
        finalCtx.fillStyle = ann.color;
        finalCtx.fillText(ann.text, ann.x, ann.y);
      }
    });
    
    return finalCanvas.toDataURL('image/png');
  };

  const handleSave = () => {
    const dataUrl = getFinalImage();
    onSave(dataUrl);
  };

  const handleCopy = () => {
    const dataUrl = getFinalImage();
    onCopyToClipboard(dataUrl);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-[10000] flex flex-col items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Toolbar */}
      <div className="bg-background rounded-lg p-2 mb-4 flex gap-2 items-center">
        <Button
          variant={tool === 'draw' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTool(tool === 'draw' ? 'none' : 'draw')}
          aria-label="Draw"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        
        <Button
          variant={tool === 'text' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTool(tool === 'text' ? 'none' : 'text')}
          aria-label="Add text"
        >
          <Type className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <div className="flex gap-1">
          {colors.map(c => (
            <button
              key={c}
              className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-primary' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>

        <div className="h-6 w-px bg-border mx-1" />

        <Button
          variant="outline"
          size="sm"
          onClick={handleUndo}
          disabled={drawHistory.length <= 1}
          aria-label="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          aria-label="Copy to clipboard"
        >
          <Copy className="h-4 w-4 mr-1" />
          Copy
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={handleSave}
          aria-label="Download"
        >
          <Download className="h-4 w-4 mr-1" />
          Save
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Canvas container */}
      <div 
        ref={containerRef}
        className="relative bg-background rounded-lg overflow-hidden"
        style={{ cursor: tool === 'draw' ? 'crosshair' : tool === 'text' ? 'text' : 'default' }}
      >
        <canvas ref={canvasRef} className="block" />
        <canvas 
          ref={overlayCanvasRef} 
          className="absolute top-0 left-0"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        
        {/* Text annotation inputs */}
        {textAnnotations.map(ann => (
          <input
            key={ann.id}
            type="text"
            value={ann.text}
            onChange={(e) => updateTextAnnotation(ann.id, e.target.value)}
            onBlur={() => setEditingText(null)}
            autoFocus={editingText === ann.id}
            className="absolute bg-transparent border-none outline-none text-base"
            style={{
              left: ann.x,
              top: ann.y - 16,
              color: ann.color,
              minWidth: '100px'
            }}
            placeholder="Type here..."
          />
        ))}
      </div>

      {!imageLoaded && (
        <div className="text-white">Loading...</div>
      )}
    </div>
  );
};
