import React, { useRef, useEffect } from 'react';
import { useHighlighter } from './pdf/useHighlighter';
import { PdfControls } from './pdf/PdfControls';

interface PdfViewerProps {
  pdfDoc: any;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ 
  pdfDoc, 
  currentPage, 
  totalPages, 
  setCurrentPage,
  selectedColor,
  isHighlighter = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const annotationLayerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    isHighlighting,
    highlightsRef,
    toggleHighlighting,
    startDrawing,
    draw,
    stopDrawing
  } = useHighlighter(currentPage);

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
          
          context.clearRect(0, 0, canvas.width, canvas.height);
          
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;

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
      }
    };

    renderPage();
  }, [pdfDoc, currentPage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', (e) => startDrawing(e, canvas));
    canvas.addEventListener('mousemove', (e) => draw(e, canvas, selectedColor));
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', (e) => startDrawing(e, canvas));
      canvas.removeEventListener('mousemove', (e) => draw(e, canvas, selectedColor));
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

  return (
    <div className="flex flex-col h-full">
      <PdfControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isHighlighting={isHighlighting}
        onToggleHighlighting={toggleHighlighting}
      />
      <div 
        className="relative flex-1 overflow-auto pb-24"
        ref={containerRef}
        style={{ 
          height: 'calc(100vh - 400px)',
          minHeight: '500px',
          paddingBottom: '6rem'
        }}
      >
        <div className="relative">
          <canvas 
            ref={canvasRef} 
            className="w-full cursor-crosshair mx-auto mb-24"
          />
          <div 
            ref={annotationLayerRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};