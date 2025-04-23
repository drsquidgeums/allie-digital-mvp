
import React, { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useToast } from '@/hooks/use-toast';
import { PdfToolbar } from './PdfToolbar';
import { usePdfHighlighter } from '@/utils/pdfHighlighter';
import { usePdfHighlighter as useRangyHighlighter } from '@/components/document-viewer/viewers/pdf/PdfHighlighter';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker using a reliable CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface FallbackPDFViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
  highlightEnabled?: boolean;
  setHighlightEnabled?: (enabled: boolean) => void;
  setSelectedColor?: (color: string) => void;
}

export const FallbackPDFViewer: React.FC<FallbackPDFViewerProps> = ({
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
  const documentContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { addHighlight, highlights } = usePdfHighlighter(selectedColor);
  const { handleHighlight } = useRangyHighlighter();
  
  // Determine file source for react-pdf
  const pdfSource = file ? file : url || null;
  
  // Track text selection in the document
  React.useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      setIsTextSelected(!!selection && !selection.isCollapsed);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);
  
  // Add highlight CSS style
  React.useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.id = 'pdf-highlight-styles';
    styleEl.innerHTML = `
      .highlight {
        background-color: ${selectedColor};
        border-radius: 2px;
      }
    `;
    document.head.appendChild(styleEl);
    
    return () => {
      const existingStyle = document.getElementById('pdf-highlight-styles');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [selectedColor]);

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
  const doHighlightSelection = () => {
    if (!documentContainerRef.current) return;
    
    try {
      handleHighlight();
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
    setPageNumber(1);
    // This will force react to re-render the document
  };
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="max-w-md p-6 bg-card rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Failed to load PDF</h3>
          <p className="text-muted-foreground mb-4">{error.message || 'Unknown error'}</p>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
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
        onHighlight={doHighlightSelection}
        onKeyboardHelp={() => {}}
        isHighlightMode={highlightEnabled}
        onToggleHighlight={toggleHighlightMode}
      />
      
      {/* PDF Document */}
      <div 
        className="flex-1 overflow-auto flex justify-center bg-muted/10 p-4"
        ref={documentContainerRef}
      >
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

export default FallbackPDFViewer;
