import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';

// Configure PDF.js worker using a reliable CDN
const workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

interface PdfRendererResult {
  page: any;
  viewport: any;
}

export const usePdfRenderer = () => {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale] = useState(1.5);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadPDF = useCallback(async (file: File | null, url: string): Promise<void> => {
    try {
      setIsLoading(true);
      let pdfData: Uint8Array;

      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        pdfData = new Uint8Array(arrayBuffer);
      } else if (url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        pdfData = new Uint8Array(arrayBuffer);
      } else {
        setIsLoading(false);
        return;
      }

      // Initialize PDF.js with the worker if needed
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
      }

      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
      
      loadingTask.onProgress = (progress) => {
        console.log(`Loading PDF: ${Math.round(progress.loaded / progress.total * 100)}%`);
      };

      const pdfDoc = await loadingTask.promise;
      setPdf(pdfDoc);
      setCurrentPage(1);
      await renderPage(1, pdfDoc);

      toast({
        title: "PDF loaded",
        description: "Document has been loaded successfully",
      });
    } catch (error) {
      console.error('Error loading PDF:', error);
      toast({
        title: "Error",
        description: "Failed to load PDF document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const renderPage = useCallback(async (
    pageNumber: number,
    pdfDoc: PDFDocumentProxy | null = pdf
  ): Promise<PdfRendererResult | undefined> => {
    if (!pdfDoc) return;

    try {
      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      return { page, viewport };
    } catch (error) {
      console.error('Error rendering page:', error);
      toast({
        title: "Error",
        description: "Failed to render PDF page",
        variant: "destructive",
      });
    }
  }, [pdf, scale, toast]);

  const handlePageChange = useCallback((newPage: number): void => {
    if (pdf && newPage >= 1 && newPage <= pdf.numPages) {
      setCurrentPage(newPage);
      renderPage(newPage);
    }
  }, [pdf, renderPage]);

  return {
    pdf,
    currentPage,
    isLoading,
    loadPDF,
    renderPage,
    handlePageChange,
  };
};