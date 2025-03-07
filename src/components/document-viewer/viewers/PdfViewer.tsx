
import React, { useEffect, useRef, useState } from 'react';
import { usePdfRenderer } from './pdf/usePdfRenderer';
import { usePdfHighlighter } from './pdf/usePdfHighlighter';
import { PdfControls } from './pdf/PdfControls';
import { LoadingFallback } from './LoadingFallback';

interface PdfViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTextLayerReady, setIsTextLayerReady] = useState(false);
  const { pdf, currentPage, totalPages, isLoading, loadPDF, renderPage, handlePageChange } = usePdfRenderer();
  const { handleHighlight } = usePdfHighlighter();

  useEffect(() => {
    const loadDocument = async () => {
      await loadPDF(file, url);
    };
    
    loadDocument();
    
    return () => {
      if (pdf) {
        pdf.destroy();
      }
    };
  }, [file, url, loadPDF, pdf]);

  useEffect(() => {
    const renderCurrentPage = async () => {
      if (!canvasRef.current) return;

      const result = await renderPage(currentPage);
      if (!result) return;

      const { page, viewport } = result;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) return;

      // Set canvas dimensions to match PDF page dimensions
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Create the rendering context
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      try {
        // Render the page
        await page.render(renderContext).promise;
        
        // Wait a bit for the render to complete before enabling text layer
        setTimeout(() => {
          setIsTextLayerReady(true);
        }, 100);
      } catch (error) {
        console.error('Error rendering PDF page:', error);
      }
    };

    if (pdf) {
      renderCurrentPage();
    }
  }, [currentPage, renderPage, pdf]);

  // Apply selected color to text highlights
  useEffect(() => {
    if (containerRef.current && isHighlighter) {
      const highlights = containerRef.current.querySelectorAll('.highlight');
      highlights.forEach((highlight) => {
        if (highlight instanceof HTMLElement) {
          highlight.style.backgroundColor = selectedColor || '#ffff00';
        }
      });
    }
  }, [selectedColor, isHighlighter]);

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <div className="flex flex-col h-full" ref={containerRef}>
      <PdfControls
        currentPage={currentPage}
        totalPages={totalPages || 1}
        onPageChange={handlePageChange}
        onHighlight={handleHighlight}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
      />
      <div className="flex-1 overflow-auto p-4 bg-white">
        <div className="relative mx-auto" style={{ width: 'fit-content' }}>
          <canvas
            ref={canvasRef}
            className="shadow-md"
            style={{ display: 'block' }}
          />
          {isTextLayerReady && (
            <div 
              className="absolute top-0 left-0 right-0 bottom-0 pointer-events-auto"
              style={{ 
                opacity: 1,
                userSelect: 'text'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
