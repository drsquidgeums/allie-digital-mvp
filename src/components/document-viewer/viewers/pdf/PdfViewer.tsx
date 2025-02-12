
import React, { useEffect, useRef, useCallback } from 'react';
import { usePdfRenderer } from './usePdfRenderer';
import { PdfControls } from './PdfControls';
import { usePdfHighlighter } from './PdfHighlighter';

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
  isHighlighter = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    pdf,
    currentPage,
    isLoading,
    loadPDF,
    renderPage,
    handlePageChange,
  } = usePdfRenderer();
  const { handleHighlight } = usePdfHighlighter();

  const renderCurrentPage = useCallback(async () => {
    if (!canvasRef.current) return;

    const result = await renderPage(currentPage);
    if (!result) return;

    const { page, viewport } = result;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions to match viewport
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Set canvas scale based on device pixel ratio
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
    canvas.width = viewport.width * pixelRatio;
    canvas.height = viewport.height * pixelRatio;
    context.scale(pixelRatio, pixelRatio);

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    try {
      await page.render(renderContext).promise;
      console.log('Page rendered successfully');
    } catch (error) {
      console.error('Error rendering PDF page:', error);
    }
  }, [currentPage, renderPage]);

  useEffect(() => {
    loadPDF(file, url);
    return () => {
      if (pdf) {
        pdf.destroy();
      }
    };
  }, [file, url, loadPDF, pdf]);

  useEffect(() => {
    renderCurrentPage();
  }, [renderCurrentPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-auto" ref={containerRef}>
      <PdfControls
        currentPage={currentPage}
        totalPages={pdf?.numPages || 1}
        onPageChange={handlePageChange}
        onHighlight={handleHighlight}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
      />
      <div className="flex-1 overflow-auto p-4">
        <canvas
          ref={canvasRef}
          className="mx-auto bg-white shadow-lg"
          style={{ backgroundColor: 'white' }}
        />
      </div>
    </div>
  );
};
