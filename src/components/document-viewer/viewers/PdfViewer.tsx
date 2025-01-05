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

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      
      if (isHighlighter) {
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = 20;
      } else {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = 2;
      }
      
      ctx.stroke();
      ctx.closePath();

      [lastX, lastY] = [x, y];
    };

    const startDrawing = (e: MouseEvent) => {
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      [lastX, lastY] = [e.clientX - rect.left, e.clientY - rect.top];
    };

    const stopDrawing = () => {
      isDrawing = false;
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