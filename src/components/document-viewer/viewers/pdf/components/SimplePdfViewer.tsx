
import React, { useState, useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import { useToast } from '@/hooks/use-toast';
import { PdfViewerControls } from './PdfViewerControls';
import { PdfDocumentViewer } from './PdfDocumentViewer';
import { HighlightsOverlay } from './HighlightsOverlay';
import { ColorSelectionPopup } from './ColorSelectionPopup';
import { usePdfHighlights } from '../hooks/usePdfHighlights';
import '@/styles/pdf/pdf-highlighter.css';
import '@/styles/pdf/pdf-highlights.css';

// Set PDF.js worker path
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
  const { toast } = useToast();

  // Use our custom hook for managing highlights
  const {
    highlights,
    selectedHighlightId,
    setSelectedHighlightId,
    updateHighlight,
    deleteHighlight,
    handleTextSelection
  } = usePdfHighlights(selectedColor);

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

  // Handle document load success
  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    console.log("Document loaded with", numPages, "pages");
  };

  // Handle text selection for highlighting
  const handleSelectText = () => {
    if (isHighlighter) {
      handleTextSelection(pageNumber);
      
      toast({
        title: "Highlight Added",
        description: "Text has been highlighted in the document",
      });
    }
  };

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/20">
        <p className="text-muted-foreground">No document loaded. Please select a PDF file.</p>
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
        isHighlighter={isHighlighter}
        selectedColor={selectedColor}
        onChangePage={changePage}
        onZoom={zoom}
        onTextSelect={handleSelectText}
        onDeleteHighlight={deleteHighlight}
      />
      
      {/* PDF Document with Highlights */}
      <PdfDocumentViewer
        pdfUrl={pdfUrl}
        pageNumber={pageNumber}
        scale={scale}
        onLoadSuccess={handleDocumentLoadSuccess}
      >
        <HighlightsOverlay
          highlights={highlights}
          pageNumber={pageNumber}
          onSelectHighlight={setSelectedHighlightId}
          selectedHighlightId={selectedHighlightId}
        />
      </PdfDocumentViewer>
      
      {/* Color selection popup for selected highlight */}
      {selectedHighlightId && (
        <ColorSelectionPopup
          selectedHighlightId={selectedHighlightId}
          onUpdateHighlight={updateHighlight}
        />
      )}
    </div>
  );
};

export default SimplePdfViewer;
