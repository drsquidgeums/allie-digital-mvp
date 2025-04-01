
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useToast } from '@/hooks/use-toast';
import { ErrorDisplay } from '../../ErrorDisplay';
import { PdfToolbar } from './PdfToolbar';
import { usePdfHighlighter } from '@/utils/pdfHighlighter';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker using a reliable CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface CustomPDFViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
  highlightEnabled?: boolean;
  setHighlightEnabled?: (enabled: boolean) => void;
  setSelectedColor?: (color: string) => void;
}

export const CustomPDFViewer: React.FC<CustomPDFViewerProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = true,
  highlightEnabled = false,
  setHighlightEnabled = () => {},
  setSelectedColor = () => {}
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [error, setError] = useState<Error | null>(null);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const { toast } = useToast();
  const { addHighlight, highlights } = usePdfHighlighter(selectedColor);
  
  // Determine file source for react-pdf
  const pdfSource = file ? file : url || null;
  
  useEffect(() => {
    // Reset error state when the file or URL changes
    setError(null);
  }, [file, url]);

  // Track text selection in the document
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      setIsTextSelected(!!selection && !selection.isCollapsed);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);
  
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

  // Handle zoom
  const zoom = (factor: number) => {
    setScale(prev => Math.max(0.5, Math.min(3, prev + factor)));
  };

  // Handle highlight
  const handleHighlight = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    
    try {
      // Get the selected text
      const text = selection.toString();
      
      // Create a unique ID for this highlight
      const highlightId = `highlight_${Date.now()}`;
      
      // Create highlight object
      addHighlight({
        id: highlightId,
        content: { text },
        comment: { text: '' },
        position: {
          // This is a simple position; in a real app, you'd need to calculate the actual coordinates
          pageNumber,
          boundingRect: { x1: 0, y1: 0, x2: 100, y2: 50, width: 100, height: 50 },
          rects: [{ x1: 0, y1: 0, x2: 100, y2: 50, width: 100, height: 50 }]
        },
      });
      
      // Apply highlighting to the DOM
      // This requires more complex logic with a library like rangy or selection.js
      // For now, we'll just show a toast notification
      toast({
        title: "Text Highlighted",
        description: `"${text.length > 30 ? text.substring(0, 30) + '...' : text}"`,
      });
      
      // Clear selection after highlighting
      selection.removeAllRanges();
      setIsTextSelected(false);
    } catch (error) {
      console.error('Error highlighting text:', error);
      toast({
        variant: "destructive",
        title: "Highlighting Error",
        description: "Could not highlight the selected text",
      });
    }
  };

  // Toggle highlight mode
  const toggleHighlightMode = () => {
    setHighlightEnabled(!highlightEnabled);
    toast({
      title: !highlightEnabled ? "Highlight Mode Activated" : "Highlight Mode Deactivated",
      description: !highlightEnabled ? "Select text to highlight it" : "Regular viewing mode"
    });
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
      <PdfToolbar
        pageNumber={pageNumber}
        numPages={numPages}
        zoom={scale}
        isTextSelected={isTextSelected}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
        onPageChange={changePage}
        onZoomChange={zoom}
        onHighlight={handleHighlight}
        onKeyboardHelp={() => {}}
        isHighlightMode={highlightEnabled}
        onToggleHighlight={toggleHighlightMode}
      />
      
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
