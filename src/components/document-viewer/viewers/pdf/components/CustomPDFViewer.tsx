
import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { useToast } from '@/hooks/use-toast';
import { ErrorDisplay } from '../../ErrorDisplay';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

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
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  // Determine file source for react-pdf
  const pdfSource = file ? file : url || null;
  
  // PDF load success handler
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setError(null);
    
    toast({
      title: "PDF Loaded Successfully",
      description: `Document has ${numPages} pages`,
    });
    
    console.log("PDF document loaded successfully with", numPages, "pages");
  };
  
  // PDF load error handler
  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error);
    setError(error);
    
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

  // Handle retry
  const handleRetry = () => {
    setError(null);
    // Force a reload of the document
    const temp = pdfSource;
    setPageNumber(1);
    // This will force react to re-render the document
    setTimeout(() => {
      // This is a hack to force re-render
    }, 100);
  };
  
  if (error) {
    return (
      <ErrorDisplay 
        title="Failed to load PDF" 
        description={`Error: ${error.message || 'Unknown error'}`}
        onRetry={handleRetry}
      />
    );
  }
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* PDF Controls */}
      <div className="flex items-center justify-between p-2 bg-card border-b">
        <div className="flex items-center space-x-2">
          <button
            className="px-2 py-1 text-sm bg-muted rounded hover:bg-muted/80"
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
          >
            Previous
          </button>
          
          <span className="text-sm">
            {pageNumber} / {numPages || '?'}
          </span>
          
          <button
            className="px-2 py-1 text-sm bg-muted rounded hover:bg-muted/80"
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
          >
            Next
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="px-2 py-1 text-sm bg-muted rounded hover:bg-muted/80"
            onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
          >
            Zoom Out
          </button>
          
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          
          <button 
            className="px-2 py-1 text-sm bg-muted rounded hover:bg-muted/80"
            onClick={() => setScale(prev => Math.min(3, prev + 0.1))}
          >
            Zoom In
          </button>
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
          error={
            <div className="flex items-center justify-center h-full">
              <p className="text-destructive">Failed to load PDF document</p>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg"
          />
        </Document>
      </div>
    </div>
  );
};

export default CustomPDFViewer;
