import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const drawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const renderPage = async () => {
      if (!canvasRef.current || !pdfDoc) return;
      
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
      }
    };

    renderPage();
  }, [pdfDoc, currentPage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const startDrawing = (e: MouseEvent) => {
      drawingRef.current = true;
      const rect = canvas.getBoundingClientRect();
      lastPosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const draw = (e: MouseEvent) => {
      if (!drawingRef.current) return;
      
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
  }, [selectedColor, isHighlighter]);

  const handlePageChange = (direction: 'prev' | 'next') => {
    const newPage = direction === 'next' 
      ? Math.min(currentPage + 1, totalPages)
      : Math.max(currentPage - 1, 1);
    
    setCurrentPage(newPage);
  };

  return (
    <div className="relative" ref={containerRef}>
      <canvas 
        ref={canvasRef} 
        className="w-full cursor-crosshair"
      />
      {totalPages > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-background/80 p-2 rounded-lg shadow">
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