
import React, { useState, useEffect, useCallback } from 'react';
import { pdfjs } from 'react-pdf';
import { useToast } from '@/hooks/use-toast';
import { PdfViewerControls } from './components/PdfViewerControls';
import { PdfDocumentViewer } from './components/PdfDocumentViewer';
import { HighlightsOverlay } from './components/HighlightsOverlay';
import { ColorSelectionPopup } from './components/ColorSelectionPopup';
import { usePdfHighlights } from './hooks/usePdfHighlights';
import '@/styles/pdf/pdf-highlighter.css';
import '@/styles/pdf/pdf-highlights.css';

// Set PDF.js worker path
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export interface SimplePdfViewerProps {
  file?: File | null;
  url?: string;
  selectedColor: string;
  isHighlighter?: boolean;
  onContentLoaded?: (content: string, fileName: string) => void;
}

export const SimplePdfViewer: React.FC<SimplePdfViewerProps> = ({
  file = null,
  url = '',
  selectedColor = '#FFFF00',
  isHighlighter = true,
  onContentLoaded
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const { toast } = useToast();
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);

  // Use our custom hook for managing highlights
  const {
    highlights,
    selectedHighlight,
    setSelectedHighlight,
    addHighlight,
    removeHighlight,
    updateHighlightColor,
    handleSelectionFinished
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
  const changePage = useCallback((offset: number) => {
    const newPage = pageNumber + offset;
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
    }
  }, [pageNumber, numPages]);

  // Handle zoom
  const zoom = useCallback((factor: number) => {
    const newScale = scale + factor;
    if (newScale >= 0.5 && newScale <= 3) {
      setScale(newScale);
    }
  }, [scale]);

  // Handle document load success
  const handleDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    console.log("Document loaded with", numPages, "pages");
    
    // If onContentLoaded is provided, extract content from the PDF
    if (onContentLoaded && file) {
      // In a real implementation, this would extract the text content from the PDF
      const fileName = file.name || 'document.pdf';
      onContentLoaded('PDF content would be extracted here', fileName);
    }
  }, [onContentLoaded, file]);

  // Handle text selection for highlighting
  const handleTextSelection = useCallback(() => {
    if (isHighlighter) {
      const selection = window.getSelection();
      if (selection && selection.toString().trim() !== '') {
        const range = selection.getRangeAt(0);
        const position = {
          boundingRect: range.getBoundingClientRect(),
          rects: Array.from(range.getClientRects()),
          pageNumber
        };
        
        const content = {
          text: selection.toString()
        };
        
        handleSelectionFinished(
          position as any,
          content,
          () => {/* hide tip function */},
          () => {/* transform selection function */}
        );
        
        toast({
          title: "Highlight Added",
          description: "Selection has been highlighted in the document",
        });
        
        selection.removeAllRanges();
      }
    }
  }, [isHighlighter, pageNumber, handleSelectionFinished, toast]);

  // Handle selecting a highlight
  const handleSelectHighlight = useCallback((id: string) => {
    setSelectedHighlightId(id);
    const highlight = highlights.find(h => h.id === id);
    if (highlight) {
      setSelectedHighlight(highlight);
    }
  }, [highlights, setSelectedHighlight]);

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
        selectedColor={selectedColor}
        onChangePage={changePage}
        onZoom={zoom}
        onTextSelect={handleTextSelection}
        onDeleteHighlight={(id) => {
          removeHighlight(id);
          setSelectedHighlightId(null);
        }}
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
          onSelectHighlight={handleSelectHighlight}
          selectedHighlightId={selectedHighlightId}
        />
      </PdfDocumentViewer>
      
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
