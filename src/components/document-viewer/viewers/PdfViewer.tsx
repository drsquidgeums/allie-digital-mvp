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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
        break;
      case 'ArrowLeft':
      case 'PageUp':
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        break;
      case 'Home':
        setCurrentPage(1);
        break;
      case 'End':
        setCurrentPage(totalPages);
        break;
    }
  };

  return (
    <div 
      className="flex flex-col h-full"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="document"
      aria-label={`PDF document, page ${currentPage} of ${totalPages}`}
    >
      <PdfControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(direction) => {
          const newPage = direction === 'next' 
            ? Math.min(currentPage + 1, totalPages)
            : Math.max(currentPage - 1, 1);
          setCurrentPage(newPage);
        }}
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
            tabIndex={0}
            role="application"
            aria-label="PDF canvas"
          />
          <div 
            ref={annotationLayerRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};