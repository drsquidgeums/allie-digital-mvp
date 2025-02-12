
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';

// Use a different approach to load the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Enable more verbose logging for debugging
const enableDebugMode = () => {
  const PDFViewerApplication = (window as any).PDFViewerApplication;
  if (PDFViewerApplication) {
    PDFViewerApplication.pdfDocument.verbosity = 1;
  }
};

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
      console.log('Starting PDF load process');
      
      let pdfData: Uint8Array | undefined;

      if (file) {
        console.log('Loading PDF from file:', file.name);
        const arrayBuffer = await file.arrayBuffer();
        pdfData = new Uint8Array(arrayBuffer);
      } else if (url) {
        console.log('Loading PDF from URL:', url);
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        pdfData = new Uint8Array(arrayBuffer);
      } else {
        console.log('No PDF source provided');
        setIsLoading(false);
        return;
      }

      if (!pdfData) {
        throw new Error('No PDF data available');
      }

      // Create loading task with more options
      const loadingTask = pdfjsLib.getDocument({
        data: pdfData,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/cmaps/',
        cMapPacked: true,
        standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/standard_fonts/',
      });
      
      loadingTask.onProgress = (progress) => {
        const percentage = progress.total ? Math.round(progress.loaded / progress.total * 100) : 0;
        console.log(`Loading PDF: ${percentage}%`);
      };

      const pdfDoc = await loadingTask.promise;
      console.log('PDF loaded successfully:', pdfDoc.numPages, 'pages');
      
      enableDebugMode();
      setPdf(pdfDoc);
      setCurrentPage(1);
      await renderPage(1, pdfDoc);

      toast({
        title: "PDF loaded",
        description: `Document loaded successfully with ${pdfDoc.numPages} pages`,
      });
    } catch (error) {
      console.error('Error loading PDF:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load PDF document. Please try again.",
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
    if (!pdfDoc) {
      console.log('No PDF document available for rendering');
      return;
    }

    try {
      console.log(`Rendering page ${pageNumber}`);
      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      console.log('Page rendered successfully');
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
      console.log(`Changing to page ${newPage}`);
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
