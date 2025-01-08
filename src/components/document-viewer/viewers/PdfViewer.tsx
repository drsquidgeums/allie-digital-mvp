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
  const annotationLayerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const drawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const highlightsRef = useRef<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const renderPage = async () => {
      if (!canvasRef.current || !annotationLayerRef.current || !pdfDoc) return;
      
      try {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        if (canvas && context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          // Clear previous content
          context.clearRect(0, 0, canvas.width, canvas.height);
          
          // Render PDF content
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;

          // Render existing highlights
          highlightsRef.current.forEach(highlight => {
            if (highlight.page === currentPage) {
              context.fillStyle = highlight.color;
              context.globalAlpha = 0.3;
              context.fillRect(
                highlight.rect.x,
                highlight.rect.y,
                highlight.rect.width,
                highlight.rect.height
              );
              context.globalAlpha = 1.0;
            }
          });
        }
      } catch (error) {
        console.error('Error rendering PDF page:', error);
        toast({
          title: "Error",
          description: "Failed to render PDF page",
          variant: "destructive",
        });
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, toast]);

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
      if (!drawingRef.current || !isHighlighting || !canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      // Save the highlight
      const highlight = {
        page: currentPage,
        color: selectedColor,
        rect: {
          x: Math.min(lastPosRef.current.x, currentX),
          y: Math.min(lastPosRef.current.y, currentY),
          width: Math.abs(currentX - lastPosRef.current.x),
          height: Math.abs(currentY - lastPosRef.current.y)
        }
      };

      // Draw the highlight
      ctx.fillStyle = selectedColor;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(
        highlight.rect.x,
        highlight.rect.y,
        highlight.rect.width,
        highlight.rect.height
      );
      ctx.globalAlpha = 1.0;

      // Store the highlight
      highlightsRef.current.push(highlight);

      lastPosRef.current = { x: currentX, y: currentY };
    };

    const stopDrawing = () => {
      if (drawingRef.current) {
        drawingRef.current = false;
      }
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
  }, [selectedColor, isHighlighter, isHighlighting, currentPage]);

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
        className="relative flex-1 overflow-auto pb-24"
        ref={containerRef}
        style={{ 
          height: 'calc(100vh - 400px)',
          minHeight: '500px'
        }}
      >
        <div className="relative">
          <canvas 
            ref={canvasRef} 
            className="w-full cursor-crosshair mx-auto"
          />
          <div 
            ref={annotationLayerRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
        </div>
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