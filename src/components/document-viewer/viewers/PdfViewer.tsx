import React, { useRef, useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { useToast } from "@/hooks/use-toast";
import { PdfPageControls } from './pdf/PdfPageControls';
import { PdfTextLayer } from './pdf/PdfTextLayer';
import { usePdfLoader } from './pdf/usePdfLoader';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const { pdfDoc, numPages } = usePdfLoader(file, url);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        const page = await pdfDoc.getPage(currentPage);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        // Enable text selection and highlighting
        const textContent = await page.getTextContent();
        const textLayer = document.createElement('div');
        textLayer.className = 'textLayer';
        textLayer.style.left = canvas.offsetLeft + 'px';
        textLayer.style.top = canvas.offsetTop + 'px';
        textLayer.style.height = viewport.height + 'px';
        textLayer.style.width = viewport.width + 'px';

        // Create text layer
        const textItems = textContent.items;
        textItems.forEach((item: any) => {
          const tx = pdfjsLib.Util.transform(
            viewport.transform,
            item.transform
          );
          const style = `
            left: ${tx[4]}px;
            top: ${tx[5]}px;
            font-size: ${Math.sqrt((tx[0] * tx[0]) + (tx[1] * tx[1])) * 1.5}px;
            transform: scaleX(${tx[0] / 1.5});
          `;
          
          const textSpan = document.createElement('span');
          textSpan.textContent = item.str;
          textSpan.setAttribute('style', style);
          textLayer.appendChild(textSpan);
        });

        canvas.parentNode?.appendChild(textLayer);
      } catch (error) {
        console.error('Error rendering PDF page:', error);
        toast({
          title: "Error rendering page",
          description: "There was a problem displaying the PDF page",
          variant: "destructive",
        });
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, toast]);

  const handlePageChange = (offset: number) => {
    setCurrentPage((prevPage) => {
      const newPage = prevPage + offset;
      return newPage >= 1 && newPage <= numPages ? newPage : prevPage;
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <PdfPageControls
        currentPage={currentPage}
        numPages={numPages}
        onPageChange={handlePageChange}
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