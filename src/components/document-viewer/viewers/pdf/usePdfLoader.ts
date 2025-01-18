import { useState, useCallback, RefObject, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { type Toast } from "@/components/ui/toast";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const usePdfLoader = (
  file: File | null,
  url: string,
  canvasRef: RefObject<HTMLCanvasElement>,
  toast: Toast
) => {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);

  const loadPDF = useCallback(async () => {
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
  }, [file, url, toast]);

  useEffect(() => {
    loadPDF();
  }, [loadPDF]);

  const renderPage = useCallback(async () => {
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

      // Create text layer
      const textContent = await page.getTextContent();
      const textLayer = document.createElement('div');
      textLayer.className = 'textLayer';
      textLayer.style.left = canvas.offsetLeft + 'px';
      textLayer.style.top = canvas.offsetTop + 'px';
      textLayer.style.height = viewport.height + 'px';
      textLayer.style.width = viewport.width + 'px';

      // Add text elements
      textContent.items.forEach((item: any) => {
        const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
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

      // Remove existing text layer if any
      const existingTextLayer = canvas.parentNode?.querySelector('.textLayer');
      if (existingTextLayer) {
        existingTextLayer.remove();
      }

      canvas.parentNode?.appendChild(textLayer);
    } catch (error) {
      console.error('Error rendering PDF page:', error);
      toast({
        title: "Error rendering page",
        description: "There was a problem displaying the PDF page",
        variant: "destructive",
      });
    }
  }, [pdfDoc, currentPage, toast]);

  const changePage = useCallback((offset: number) => {
    setCurrentPage((prevPage) => {
      const newPage = prevPage + offset;
      return newPage >= 1 && newPage <= numPages ? newPage : prevPage;
    });
  }, [numPages]);

  return {
    pdfDoc,
    currentPage,
    numPages,
    changePage,
    renderPage,
  };
};