
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

/**
 * usePdfRenderer Hook
 * 
 * A custom hook that provides PDF rendering functionality using PDF.js.
 * Handles loading, rendering, and page navigation for PDF documents.
 * 
 * @returns Object containing PDF state and operations to manage PDF rendering
 */
export const usePdfRenderer = () => {
  // State management
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale] = useState(1.5); // Default zoom level
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  /**
   * Loads a PDF document from either a File object or a URL
   * 
   * @param file - File object containing PDF data
   * @param url - URL to PDF document
   */
  const loadPDF = useCallback(async (file: File | null, url: string): Promise<void> => {
    try {
      setIsLoading(true);
      let pdfData: Uint8Array;

      // Get PDF data from either file or URL
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

      // Create a loading task to parse the PDF data
      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
      
      // Report loading progress to console
      loadingTask.onProgress = (progress) => {
        console.log(`Loading PDF: ${Math.round(progress.loaded / progress.total * 100)}%`);
      };

      // Wait for the PDF to load and set initial state
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

  /**
   * Renders a specific page of the PDF document
   * 
   * @param pageNumber - The page number to render (1-based index)
   * @param pdfDoc - The PDF document object (optional, uses state if not provided)
   * @returns An object containing the page and viewport if successful
   */
  const renderPage = useCallback(async (
    pageNumber: number,
    pdfDoc: PDFDocumentProxy | null = pdf
  ): Promise<PdfRendererResult | undefined> => {
    if (!pdfDoc) return;

    try {
      // Get the page object from the PDF document
      const page = await pdfDoc.getPage(pageNumber);
      
      // Create a viewport for the page at the current scale
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

  /**
   * Changes the current page being displayed
   * 
   * @param newPage - The page number to display
   */
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
