import React, { useEffect, useRef, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from 'pdfjs-dist';
import * as rangy from 'rangy';
// Import required Rangy modules
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';
import 'rangy/lib/rangy-textrange';
import type { PDFDocumentProxy } from 'pdfjs-dist';

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
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [isLoading, setIsLoading] = useState(true);
  const highlighterRef = useRef<any>(null);

  useEffect(() => {
    try {
      // Initialize Rangy with required modules
      rangy.init();
      
      // Check if the highlighter module is loaded
      if (typeof rangy.createHighlighter !== 'function') {
        console.error('Rangy highlighter module not loaded properly');
        return;
      }

      // Create highlighter instance
      highlighterRef.current = rangy.createHighlighter();
      
      // Add class applier for highlights
      highlighterRef.current.addClassApplier(rangy.createClassApplier('highlight', {
        ignoreWhiteSpace: true,
        tagNames: ['span', 'a']
      }));

      return () => {
        if (pdf) {
          pdf.destroy();
        }
      };
    } catch (error) {
      console.error('Error initializing Rangy:', error);
      toast({
        title: "Error",
        description: "Failed to initialize text highlighting",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true);
        let pdfData;
        
        if (file) {
          const arrayBuffer = await file.arrayBuffer();
          pdfData = new Uint8Array(arrayBuffer);
        } else if (url) {
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          pdfData = new Uint8Array(arrayBuffer);
        } else {
          return;
        }

        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
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
          description: "Failed to load PDF document",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [file, url]);

  const renderPage = async (pageNumber: number, pdfDoc: PDFDocumentProxy = pdf!) => {
    if (!canvasRef.current || !pdfDoc) return;

    try {
      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d')!;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    } catch (error) {
      console.error('Error rendering page:', error);
      toast({
        title: "Error",
        description: "Failed to render PDF page",
        variant: "destructive",
      });
    }
  };

  const handleHighlight = () => {
    if (!highlighterRef.current) {
      console.error('Highlighter not initialized');
      return;
    }
    
    try {
      const selection = rangy.getSelection();
      if (selection.rangeCount > 0) {
        highlighterRef.current.highlightSelection('highlight', {
          exclusive: false
        });
        
        toast({
          title: "Text highlighted",
          description: "Selection has been highlighted",
        });
      }
    } catch (error) {
      console.error('Error highlighting text:', error);
      toast({
        title: "Error",
        description: "Failed to highlight text",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (pdf && newPage >= 1 && newPage <= pdf.numPages) {
      setCurrentPage(newPage);
      renderPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="flex justify-between p-4 border-b">
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-1 bg-primary text-primary-foreground rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {currentPage} of {pdf?.numPages || 1}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pdf || currentPage >= pdf.numPages}
            className="px-3 py-1 bg-primary text-primary-foreground rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        {isHighlighter && (
          <button
            onClick={handleHighlight}
            className="px-3 py-1 rounded"
            style={{ backgroundColor: selectedColor, color: 'white' }}
          >
            Highlight Selection
          </button>
        )}
      </div>
      <div className="flex-1 overflow-auto p-4">
        <canvas
          ref={canvasRef}
          className="mx-auto"
          style={{ backgroundColor: 'white' }}
        />
      </div>
    </div>
  );
};