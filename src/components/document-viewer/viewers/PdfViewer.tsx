import React, { useRef, useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { useToast } from "@/hooks/use-toast";

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
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const loadPDF = async () => {
      try {
        let pdfUrl: string | ArrayBuffer;
        
        if (file) {
          const arrayBuffer = await file.arrayBuffer();
          pdfUrl = arrayBuffer;
        } else if (url) {
          pdfUrl = url;
        } else {
          return;
        }

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);

        toast({
          title: "PDF loaded successfully",
          description: `Total pages: ${pdf.numPages}`,
        });
      } catch (error) {
        console.error('Error loading PDF:', error);
        toast({
          title: "Error loading PDF",
          description: "There was a problem loading the PDF document",
          variant: "destructive",
        });
      }
    };

    loadPDF();
  }, [file, url]);

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
  }, [pdfDoc, currentPage]);

  const changePage = (offset: number) => {
    setCurrentPage((prevPage) => {
      const newPage = prevPage + offset;
      return newPage >= 1 && newPage <= numPages ? newPage : prevPage;
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => changePage(-1)}
          disabled={currentPage <= 1}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {numPages}
        </span>
        <button
          onClick={() => changePage(1)}
          disabled={currentPage >= numPages}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div 
        className="relative border border-border rounded-lg overflow-hidden"
        style={{ width: 'fit-content' }}
      >
        <canvas ref={canvasRef} className="max-w-full" />
      </div>
      <style>
        {`
          .textLayer {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            opacity: 0.2;
            line-height: 1.0;
          }

          .textLayer > span {
            color: transparent;
            position: absolute;
            white-space: pre;
            cursor: text;
            transform-origin: 0% 0%;
          }

          .textLayer ::selection {
            background: ${selectedColor};
            opacity: 0.3;
          }
        `}
      </style>
    </div>
  );
};