import React, { useEffect, useRef, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from 'pdfjs-dist';
import * as rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { pdfjs } from 'pdfjs-dist';

// Initialize PDF.js worker using the bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

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
    const loadPDF = async () => {
      try {
        setIsLoading(true);
        console.log('Loading PDF with file:', file?.name, 'or URL:', url);
        
        let pdfData: Uint8Array | string;
        
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
    };

    loadPDF();

    return () => {
      if (pdf) {
        pdf.destroy();
      }
    };
  }, [file, url]);

  const renderPage = async (pageNumber: number, pdfDoc: PDFDocumentProxy = pdf!) => {
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

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
      console.log('Page rendered successfully');
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
    if (!highlighterRef.current) return;
    
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