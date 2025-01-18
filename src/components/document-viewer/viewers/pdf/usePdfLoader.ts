import React, { useState, useCallback, RefObject } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { type ToastProps } from "@/components/ui/toast";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface UsePdfLoaderProps {
  file: File | null;
  url: string;
  canvasRef: RefObject<HTMLCanvasElement>;
  toast: {
    toast: (props: ToastProps) => void;
  };
}

export const usePdfLoader = ({
  file,
  url,
  canvasRef,
  toast
}: UsePdfLoaderProps) => {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);

  const loadPDF = useCallback(async () => {
    if (!file && !url) return;

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

      toast.toast({
        title: "PDF loaded successfully",
        variant: "default",
        children: `Total pages: ${pdf.numPages}`
      });
    } catch (error) {
      console.error('Error loading PDF:', error);
      toast.toast({
        title: "Error loading PDF",
        variant: "destructive",
        children: "There was a problem loading the PDF document"
      });
    }
  }, [file, url, toast]);

  React.useEffect(() => {
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
    } catch (error) {
      console.error('Error rendering PDF page:', error);
      toast.toast({
        title: "Error rendering page",
        variant: "destructive",
        children: "There was a problem displaying the PDF page"
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