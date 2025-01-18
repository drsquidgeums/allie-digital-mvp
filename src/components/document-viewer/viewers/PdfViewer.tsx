import React, { useEffect, useRef, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from 'pdfjs-dist';
import * as rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.5);
  const highlighterRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Rangy
    rangy.init();
    highlighterRef.current = rangy.createHighlighter();
    highlighterRef.current.addClassApplier(rangy.createClassApplier('highlight', {
      ignoreWhiteSpace: true,
      tagNames: ['span', 'a']
    }));

    return () => {
      if (pdf) {
        pdf.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const fileUrl = file ? URL.createObjectURL(file) : url;
        if (!fileUrl) return;

        const loadingTask = pdfjsLib.getDocument(fileUrl);
        const pdfDoc = await loadingTask.promise;
        setPdf(pdfDoc);
        renderPage(1, pdfDoc);

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
    if (!highlighterRef.current) return;
    
    const selection = rangy.getSelection();
    if (selection.rangeCount > 0) {
      highlighterRef.current.highlightSelection('highlight', {
        containerElementId: containerRef.current?.id,
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

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full overflow-auto"
      id="pdf-container"
    >
      <div className="flex justify-between p-4 border-b">
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-1 bg-primary text-primary-foreground rounded"
          >
            Previous
          </button>
          <span>Page {currentPage} of {pdf?.numPages || 1}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pdf || currentPage >= pdf.numPages}
            className="px-3 py-1 bg-primary text-primary-foreground rounded"
          >
            Next
          </button>
        </div>
        <button
          onClick={handleHighlight}
          className="px-3 py-1 bg-accent text-accent-foreground rounded"
          style={{ backgroundColor: selectedColor }}
        >
          Highlight Selection
        </button>
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