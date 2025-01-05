import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PdfViewerProps {
  pdfDoc: any;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export const PdfViewer = ({ pdfDoc, currentPage, totalPages, setCurrentPage }: PdfViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const handlePageChange = (direction: 'prev' | 'next') => {
    const newPage = direction === 'next' 
      ? Math.min(currentPage + 1, totalPages)
      : Math.max(currentPage - 1, 1);
    
    setCurrentPage(newPage);
  };

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full" />
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