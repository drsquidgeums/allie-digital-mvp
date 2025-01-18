import React, { useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { PdfPageControls } from './pdf/PdfPageControls';
import { PdfTextLayer } from './pdf/PdfTextLayer';
import { usePdfLoader } from './pdf/usePdfLoader';

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
  const { toast } = useToast();

  const { pdfDoc, currentPage, numPages, changePage, renderPage } = usePdfLoader({
    file,
    url,
    canvasRef,
    toast: { toast }
  });

  React.useEffect(() => {
    if (pdfDoc && canvasRef.current) {
      renderPage();
    }
  }, [pdfDoc, currentPage, renderPage]);

  if (!pdfDoc) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading PDF...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4" ref={containerRef}>
      <PdfPageControls
        currentPage={currentPage}
        numPages={numPages}
        onPageChange={changePage}
      />
      <div 
        className="relative border border-border rounded-lg overflow-auto max-h-[calc(100vh-200px)]"
        style={{ width: 'fit-content' }}
      >
        <canvas 
          ref={canvasRef} 
          className="max-w-full"
        />
        {isHighlighter && (
          <PdfTextLayer selectedColor={selectedColor} />
        )}
      </div>
    </div>
  );
};