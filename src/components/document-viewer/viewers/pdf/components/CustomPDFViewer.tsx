
import React, { useEffect, useRef, useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Highlighter,
  Undo
} from 'lucide-react';

interface CustomPDFViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const CustomPDFViewer: React.FC<CustomPDFViewerProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = true
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [highlights, setHighlights] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const pdfDocRef = useRef<PDFDocument | null>(null);
  const fileDataRef = useRef<Uint8Array | null>(null);
  
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true);
        
        let pdfBytes: Uint8Array;
        
        if (file) {
          const arrayBuffer = await file.arrayBuffer();
          pdfBytes = new Uint8Array(arrayBuffer);
        } else if (url) {
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          pdfBytes = new Uint8Array(arrayBuffer);
        } else {
          setIsLoading(false);
          return;
        }
        
        fileDataRef.current = pdfBytes;
        
        // Load the PDF document
        const pdfDoc = await PDFDocument.load(pdfBytes);
        pdfDocRef.current = pdfDoc;
        
        // Get the number of pages
        const pageCount = pdfDoc.getPageCount();
        setNumPages(pageCount);
        
        // Initialize with first page
        setCurrentPage(1);
        
        // Render the first page
        renderPage(1, pdfDoc);
        
        toast({
          title: "PDF loaded successfully",
          description: `Document has ${pageCount} pages`,
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
    
    return () => {
      // Clean up if needed
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };
  }, [file, url, toast]);
  
  useEffect(() => {
    if (pdfDocRef.current) {
      renderPage(currentPage, pdfDocRef.current);
    }
  }, [currentPage, zoom, rotation]);
  
  const renderPage = async (pageNumber: number, pdfDoc: PDFDocument) => {
    if (!canvasRef.current) return;
    
    try {
      setIsLoading(true);
      
      // Get the PDF page
      const page = pdfDoc.getPage(pageNumber - 1);
      
      // Get the canvas and context
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) {
        console.error('Canvas context is null');
        return;
      }
      
      // Calculate the dimensions for the canvas based on the PDF page
      const { width, height } = page.getSize();
      
      // Apply zoom and rotation
      const scaledWidth = width * zoom;
      const scaledHeight = height * zoom;
      
      // Set canvas dimensions
      canvas.width = rotation % 180 === 0 ? scaledWidth : scaledHeight;
      canvas.height = rotation % 180 === 0 ? scaledHeight : scaledWidth;
      
      // Clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Save the canvas state
      context.save();
      
      // Move to the center of the canvas
      context.translate(canvas.width / 2, canvas.height / 2);
      
      // Rotate the canvas
      context.rotate((rotation * Math.PI) / 180);
      
      // Translate back to render the PDF
      context.translate(-scaledWidth / 2, -scaledHeight / 2);
      
      // Now we need to render the PDF page
      // Since pdf-lib doesn't have direct rendering to canvas,
      // we'll use the PDF page's data to render on canvas
      
      // Draw highlights if any
      highlights
        .filter(h => h.page === currentPage)
        .forEach(highlight => {
          context.fillStyle = highlight.color;
          context.globalAlpha = 0.3;
          context.fillRect(
            highlight.position.x * zoom,
            highlight.position.y * zoom,
            highlight.position.width * zoom,
            highlight.position.height * zoom
          );
          context.globalAlpha = 1.0;
        });
      
      // Restore the canvas state
      context.restore();
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error rendering page:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to render PDF page",
        variant: "destructive",
      });
    }
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= numPages) {
      setCurrentPage(newPage);
    }
  };
  
  const handleZoom = (delta: number) => {
    setZoom(prev => {
      const newZoom = prev + delta;
      return newZoom >= 0.5 && newZoom <= 3 ? newZoom : prev;
    });
  };
  
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };
  
  const handleHighlight = () => {
    if (!canvasRef.current || !isHighlighter) return;
    
    const canvas = canvasRef.current;
    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    
    const startDrawing = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      isDrawing = true;
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
    };
    
    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;
      
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      
      // Create a temporary canvas for the selection rectangle
      const context = canvas.getContext('2d');
      if (!context) return;
      
      // Redraw the page to clear previous selection rectangle
      if (pdfDocRef.current) {
        renderPage(currentPage, pdfDocRef.current);
      }
      
      // Draw the selection rectangle
      context.fillStyle = selectedColor;
      context.globalAlpha = 0.3;
      context.fillRect(
        Math.min(startX, currentX),
        Math.min(startY, currentY),
        Math.abs(currentX - startX),
        Math.abs(currentY - startY)
      );
      context.globalAlpha = 1.0;
    };
    
    const endDrawing = (e: MouseEvent) => {
      if (!isDrawing) return;
      
      const rect = canvas.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;
      
      // Add highlight to the list
      const newHighlight = {
        id: Date.now().toString(),
        page: currentPage,
        color: selectedColor,
        position: {
          x: Math.min(startX, endX),
          y: Math.min(startY, endY),
          width: Math.abs(endX - startX),
          height: Math.abs(endY - startY)
        }
      };
      
      setHighlights(prev => [...prev, newHighlight]);
      
      // Remove event listeners
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', endDrawing);
      
      isDrawing = false;
      
      toast({
        title: "Highlight added",
        description: "The selected text has been highlighted",
      });
    };
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDrawing);
    
    toast({
      title: "Highlight mode",
      description: "Click and drag to highlight text",
    });
  };
  
  const handleDownload = async () => {
    if (!pdfDocRef.current || !fileDataRef.current) return;
    
    try {
      // Create a new PDF document for download
      const pdfDoc = await PDFDocument.load(fileDataRef.current);
      
      // Add highlights as annotations
      for (const highlight of highlights) {
        const page = pdfDoc.getPage(highlight.page - 1);
        const { x, y, width, height } = highlight.position;
        
        // Convert color from hex to rgb
        const colorHex = highlight.color.replace('#', '');
        const r = parseInt(colorHex.substr(0, 2), 16) / 255;
        const g = parseInt(colorHex.substr(2, 2), 16) / 255;
        const b = parseInt(colorHex.substr(4, 2), 16) / 255;
        
        // Draw a rectangle on the page for the highlight
        page.drawRectangle({
          x,
          y: page.getHeight() - y - height,
          width,
          height,
          color: rgb(r, g, b),
          opacity: 0.3,
        });
      }
      
      // Save the modified PDF
      const pdfBytes = await pdfDoc.save();
      
      // Create a blob and download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = file ? file.name.replace('.pdf', '_annotated.pdf') : 'document_annotated.pdf';
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download complete",
        description: "PDF with highlights has been downloaded",
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive",
      });
    }
  };
  
  const undoLastHighlight = () => {
    setHighlights(prev => prev.slice(0, -1));
  };
  
  return (
    <div className="flex flex-col h-full bg-card overflow-hidden">
      {/* Toolbar */}
      <div className="p-2 border-b flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {numPages}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleZoom(-0.1)}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(zoom * 100)}%</span>
          <Button variant="outline" size="sm" onClick={() => handleZoom(0.1)}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleRotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          {isHighlighter && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleHighlight}
                style={{ background: selectedColor, color: '#fff' }}
              >
                <Highlighter className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={undoLastHighlight}
                disabled={highlights.length === 0}
              >
                <Undo className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* PDF Viewer */}
      <div className="flex-1 flex justify-center items-center bg-muted/10 overflow-auto p-4">
        {isLoading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        ) : (
          <div className="relative">
            <canvas 
              ref={canvasRef} 
              className="shadow-lg bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
};
