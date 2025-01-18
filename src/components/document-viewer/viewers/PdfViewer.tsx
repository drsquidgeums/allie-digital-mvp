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
  const { toast } = useToast();
  const { pdfDoc, currentPage, numPages, changePage, renderPage } = usePdfLoader({
    file,
    url,
    canvasRef,
    toast
  });

  React.useEffect(() => {
    if (pdfDoc && canvasRef.current) {
      renderPage();
    }
  }, [pdfDoc, currentPage, renderPage]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <PdfPageControls
        currentPage={currentPage}
        numPages={numPages}
        onPageChange={changePage}
      />
      <div 
        className="relative border border-border rounded-lg overflow-hidden"
        style={{ width: 'fit-content' }}
      >
        <canvas ref={canvasRef} className="max-w-full" />
      </div>
      <PdfTextLayer selectedColor={selectedColor} />
    </div>
  );
};