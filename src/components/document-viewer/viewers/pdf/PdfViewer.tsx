
import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Maximize 
} from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import '@/styles/pdf/pdf-base.css';

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
  isHighlighter = true
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const { toast } = useToast();
  
  // File source determination - only create one source
  const pdfSource = file ? { data: file } : url ? { url } : null;
  
  // Clean up URL object if needed
  useEffect(() => {
    // No cleanup needed here as we're using the structured pdfSource object
    // that handles File objects properly
    return () => {};
  }, [file, url]);
  
  // PDF load success handler
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    
    toast({
      title: "PDF Loaded Successfully",
      description: `Document has ${numPages} pages`,
    });
    
    console.log("PDF document loaded successfully with", numPages, "pages");
  };
  
  // PDF load error handler
  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error);
    
    toast({
      variant: "destructive",
      title: "Failed to load PDF",
      description: "There was an error loading the document. Please try again.",
    });
  };
  
  // Page navigation
  const changePage = (offset: number) => {
    const newPage = pageNumber + offset;
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
    }
  };
  
  // Zoom controls
  const zoom = (factor: number) => {
    const newScale = scale + factor;
    // Limit zoom between 0.5 and 3
    if (newScale >= 0.5 && newScale <= 3) {
      setScale(newScale);
    }
  };
  
  // Fit to screen
  const fitToScreen = () => {
    setScale(1.0); // Reset to default scale
    toast({
      title: "Fit to Screen",
      description: "Document adjusted to fit the screen",
    });
  };
  
  // Rotate document
  const rotateDocument = () => {
    setRotation((rotation + 90) % 360);
  };
  
  if (!pdfSource) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/20">
        <p className="text-muted-foreground">No document loaded. Please select a PDF file.</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* PDF Controls */}
      <div className="flex items-center justify-between p-2 bg-card border-b">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm">
            {pageNumber} / {numPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => zoom(-0.1)}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => zoom(0.1)}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fitToScreen} 
            title="Fit to screen"
            aria-label="Fit to screen"
          >
            <Maximize className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={rotateDocument}
            aria-label="Rotate document"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* PDF Document */}
      <div className="flex-1 overflow-auto flex justify-center bg-muted/10 p-4">
        <Document
          file={pdfSource}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
          className="pdf-container"
          role="document"
          aria-label="PDF document"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            rotate={rotation}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg"
            role="region"
            aria-label={`Page ${pageNumber} of ${numPages}`}
          />
        </Document>
      </div>
    </div>
  );
};
