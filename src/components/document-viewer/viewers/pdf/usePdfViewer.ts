import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from 'pdfjs-dist';
import * as rangy from 'rangy';
import type { PDFDocumentProxy } from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const usePdfViewer = (file: File | null, url: string, isHighlighter: boolean) => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [isLoading, setIsLoading] = useState(true);
  const highlighterRef = useRef<any>(null);

  const renderPage = async (pageNumber: number, pdfDoc = pdf) => {
    if (!canvasRef.current || !pdfDoc) {
      console.log('No canvas or PDF document available');
      return;
    }

    try {
      console.log('Rendering page', pageNumber);
      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        console.error('Could not get canvas context');
        return;
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      console.log('Page rendered successfully');
    } catch (error) {
      console.error('Error rendering page:', error);
      toast({
        title: "Error",
        description: "Failed to render PDF page",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true);
        console.log('Loading PDF with file:', file?.name, 'or URL:', url);

        let pdfData: Uint8Array;
        if (file) {
          const arrayBuffer = await file.arrayBuffer();
          pdfData = new Uint8Array(arrayBuffer);
        } else if (url) {
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          pdfData = new Uint8Array(arrayBuffer);
        } else {
          console.log('No PDF source provided');
          setIsLoading(false);
          return;
        }

        console.log('PDF data loaded, creating document');
        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        const pdfDoc = await loadingTask.promise;
        console.log('PDF document created with', pdfDoc.numPages, 'pages');

        setPdf(pdfDoc);
        setCurrentPage(1);
        await renderPage(1, pdfDoc);

        if (isHighlighter) {
          rangy.init();
          const highlighter = rangy.createHighlighter();
          highlighter.addClassApplier(rangy.createClassApplier('highlighted', {
            ignoreWhiteSpace: true,
            tagNames: ['span']
          }));
          highlighterRef.current = highlighter;
        }

        toast({
          title: "PDF loaded",
          description: "Document has been loaded successfully"
        });
      } catch (error) {
        console.error('Error loading PDF:', error);
        toast({
          title: "Error",
          description: "Failed to load PDF document. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPDF();

    return () => {
      if (pdf) {
        pdf.destroy();
      }
    };
  }, [file, url, isHighlighter, toast]);

  const handleHighlight = () => {
    if (!highlighterRef.current) return;
    
    const selection = rangy.getSelection();
    if (selection.rangeCount > 0) {
      highlighterRef.current.highlightSelection('highlight', {
        exclusive: false
      });
      
      toast({
        title: "Text highlighted",
        description: "Selection has been highlighted"
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (pdf && newPage >= 1 && newPage <= pdf.numPages) {
      setCurrentPage(newPage);
      renderPage(newPage);
    }
  };

  return {
    canvasRef,
    pdf,
    currentPage,
    isLoading,
    handlePageChange,
    handleHighlight
  };
};