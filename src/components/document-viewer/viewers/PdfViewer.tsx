import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Highlighter } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { useToast } from '@/hooks/use-toast';

interface PdfViewerProps {
  pdfDoc: any;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const PdfViewer = ({ 
  pdfDoc, 
  currentPage, 
  totalPages, 
  setCurrentPage,
  selectedColor,
  isHighlighter = false 
}: PdfViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const drawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const { toast } = useToast();

  useEffect(() => {
    const renderPage = async () => {
      if (!canvasRef.current || !pdfDoc) return;
      
      try {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        if (canvas && context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;

          // Restore any previous highlights
          const annotations = await page.getAnnotations();
          annotations.forEach((annotation: any) => {
            if (annotation.subtype === 'Highlight') {
              const rect = annotation.rect;
              context.fillStyle = annotation.color || 'yellow';
              context.globalAlpha = 0.3;
              context.fillRect(rect[0], rect[1], rect[2] - rect[0], rect[3] - rect[1]);
              context.globalAlpha = 1.0;
            }
          });
        }
      } catch (error) {
        console.error('Error rendering PDF page:', error);
      }
    };

    renderPage();
  }, [pdfDoc, currentPage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const startDrawing = (e: MouseEvent) => {
      if (!isHighlighting) return;
      drawingRef.current = true;
      const rect = canvas.getBoundingClientRect();
      lastPosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const draw = (e: MouseEvent) => {
      if (!drawingRef.current || !isHighlighting) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(currentX, currentY);
      
      if (isHighlighter) {
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 20;
        ctx.strokeStyle = selectedColor;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      } else {
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
        ctx.strokeStyle = selectedColor;
      }
      
      ctx.stroke();
      ctx.closePath();

      lastPosRef.current = { x: currentX, y: currentY };
    };

    const stopDrawing = () => {
      drawingRef.current = false;
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
    };
  }, [selectedColor, isHighlighter, isHighlighting]);

  const handlePageChange = (direction: 'prev' | 'next') => {
    const newPage = direction === 'next' 
      ? Math.min(currentPage + 1, totalPages)
      : Math.max(currentPage - 1, 1);
    
    setCurrentPage(newPage);
  };

  const toggleHighlighting = () => {
    setIsHighlighting(!isHighlighting);
    toast({
      title: isHighlighting ? "Highlighting disabled" : "Highlighting enabled",
      description: isHighlighting ? "Click to re-enable highlighting" : "Click and drag to highlight text",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end mb-2 px-4">
        <Button
          variant={isHighlighting ? "secondary" : "outline"}
          size="sm"
          onClick={toggleHighlighting}
          className="flex items-center gap-2"
        >
          <Highlighter className="h-4 w-4" />
          {isHighlighting ? "Disable" : "Enable"} Highlighter
        </Button>
      </div>
      <div 
        className="relative flex-1 overflow-auto"
        ref={containerRef}
        style={{ 
          height: 'calc(100vh - 350px)',
          marginBottom: '6rem'
        }}
      >
        <canvas 
          ref={canvasRef} 
          className="w-full cursor-crosshair mx-auto"
        />
      </div>
      {totalPages > 1 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-background/80 p-2 rounded-lg shadow z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange('next')}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};