import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Highlight {
  page: number;
  color: string;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const useHighlighter = (currentPage: number) => {
  const [isHighlighting, setIsHighlighting] = useState(false);
  const drawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const highlightsRef = useRef<Highlight[]>([]);
  const { toast } = useToast();

  const toggleHighlighting = () => {
    setIsHighlighting(!isHighlighting);
    toast({
      title: isHighlighting ? "Highlighting disabled" : "Highlighting enabled",
      description: isHighlighting ? "Click to re-enable highlighting" : "Click and drag to highlight text",
    });
  };

  const startDrawing = (e: MouseEvent, canvas: HTMLCanvasElement) => {
    if (!isHighlighting) return;
    drawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    lastPosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const draw = (e: MouseEvent, canvas: HTMLCanvasElement, color: string) => {
    if (!drawingRef.current || !isHighlighting) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const highlight: Highlight = {
      page: currentPage,
      color: color,
      rect: {
        x: Math.min(lastPosRef.current.x, currentX),
        y: Math.min(lastPosRef.current.y, currentY),
        width: Math.abs(currentX - lastPosRef.current.x),
        height: Math.abs(currentY - lastPosRef.current.y)
      }
    };

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(
      highlight.rect.x,
      highlight.rect.y,
      highlight.rect.width,
      highlight.rect.height
    );
    ctx.globalAlpha = 1.0;

    highlightsRef.current.push(highlight);
  };

  const stopDrawing = () => {
    drawingRef.current = false;
  };

  return {
    isHighlighting,
    highlightsRef,
    toggleHighlighting,
    startDrawing,
    draw,
    stopDrawing
  };
};