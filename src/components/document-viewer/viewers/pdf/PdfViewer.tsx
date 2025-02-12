
import React, { useEffect, useRef } from 'react';
import { usePdfRenderer } from './usePdfRenderer';

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
  const { pdf, currentPage, isLoading, loadPDF, renderPage, handlePageChange } = usePdfRenderer();

  useEffect(() => {
    loadPDF(file, url);
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
      const context = canvas.getContext('2d')!;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    };

    renderCurrentPage();
  }, [currentPage, renderPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="flex justify-between items-center p-2 border-b">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-2 py-1 rounded bg-primary/10 hover:bg-primary/20 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {pdf?.numPages || 1}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pdf || currentPage >= pdf.numPages}
            className="px-2 py-1 rounded bg-primary/10 hover:bg-primary/20 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <canvas
          ref={canvasRef}
          className="mx-auto"
          style={{ backgroundColor: 'white' }}
        />
      </div>
    </div>
  );
};
