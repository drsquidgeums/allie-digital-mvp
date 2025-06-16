
import React, { useState, useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import { useToast } from '@/hooks/use-toast';
import { PdfViewerControls } from './PdfViewerControls';
import { PdfDocument } from './PdfDocument';
import { ColorSelectionPopup } from './ColorSelectionPopup';
import { usePdfHighlights } from '../hooks/usePdfHighlights';
import { useTextSelection } from '../hooks/useTextSelection';
import '@/styles/pdf/pdf-highlighter.css';
import '@/styles/pdf/pdf-highlights.css';
import '@/styles/pdf/pdf-text-layer.css';

// Configure PDF.js worker with unpkg CDN for better reliability
const PDFJS_VERSION = '3.4.120';
const WORKER_URL = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`;

if (!pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = WORKER_URL;
}

interface SimplePdfViewerProps {
  file?: File | null;
  url?: string;
  selectedColor: string;
  isHighlighter?: boolean;
  onContentLoaded?: (content: string, fileName: string) => void;
}

export const SimplePdfViewer: React.FC<SimplePdfViewerProps> = ({
  file,
  url = '',
  selectedColor = '#FFFF00',
  isHighlighter = true,
  onContentLoaded
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { toast } = useToast();

  // Use our custom hook for managing highlights
  const {
    highlights,
    addHighlight,
    removeHighlight,
    updateHighlightColor,
    handleSelectionFinished
  } = usePdfHighlights(selectedColor);

  // Use the text selection hook
  const { handleTextSelection } = useTextSelection(
    pageNumber,
    isHighlighter,
    handleSelectionFinished
  );

  // File source determination
  const pdfUrl = file ? URL.createObjectURL(file) : url;
  
  // Clean up object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (file && pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [file, pdfUrl]);

  // Handle page change
  const changePage = (offset: number) => {
    const newPage = pageNumber + offset;
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
    }
  };

  // Handle zoom
  const zoom = (factor: number) => {
    const newScale = scale + factor;
    if (newScale >= 0.5 && newScale <= 3) {
      setScale(newScale);
    }
  };
  
  // Fit to screen
  const fitToScreen = () => {
    setScale(1.0);
    toast({
      title: "Fit to Screen",
      description: "Document adjusted to fit screen",
    });
  };

  // Handle document load success
  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoadError(null);
    console.log("Document loaded with", numPages, "pages");
    
    toast({
      title: "PDF Loaded Successfully",
      description: `Document has ${numPages} pages`,
    });
  };

  // Handle document load error
  const handleDocumentLoadError = (error: Error) => {
    console.error("PDF loading error:", error);
    setLoadError(error.message);
    toast({
      title: "PDF Loading Failed",
      description: "There was a problem loading the PDF. Please try a different file.",
      variant: "destructive",
    });
  };

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/20">
        <p className="text-muted-foreground">No document loaded. Please select a PDF file.</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/20">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load PDF</p>
          <p className="text-sm text-muted-foreground mb-4">{loadError}</p>
          <button 
            onClick={() => setLoadError(null)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* PDF Controls */}
      <PdfViewerControls
        pageNumber={pageNumber}
        numPages={numPages}
        scale={scale}
        selectedHighlightId={selectedHighlightId}
        selectedColor={selectedColor}
        onChangePage={changePage}
        onZoom={zoom}
        onFitToScreen={fitToScreen}
        onTextSelect={handleTextSelection}
        onDeleteHighlight={(id) => {
          removeHighlight(id);
          setSelectedHighlightId(null);
        }}
      />
      
      {/* PDF Document with Highlights */}
      <PdfDocument
        file={pdfUrl}
        pageNumber={pageNumber}
        zoom={scale}
        highlights={highlights}
        selectedHighlightId={selectedHighlightId}
        onLoadSuccess={handleDocumentLoadSuccess}
        onLoadError={handleDocumentLoadError}
        onHighlightClick={setSelectedHighlightId}
      />
      
      {/* Color selection popup for selected highlight */}
      {selectedHighlightId && (
        <ColorSelectionPopup
          selectedHighlightId={selectedHighlightId}
          onUpdateHighlight={updateHighlightColor}
        />
      )}
    </div>
  );
};

export default SimplePdfViewer;
