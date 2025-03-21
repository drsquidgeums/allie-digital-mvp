
import React, { useState, useRef, useCallback } from 'react';
import { 
  PdfLoader, 
  PdfHighlighter as ReactPdfHighlighter
} from 'react-pdf-highlighter';
import { useToast } from '@/hooks/use-toast';
import '@/styles/pdf/pdf-highlights.css';

import { PdfHighlightToolbar } from './components/PdfHighlightToolbar';
import { HighlightOptionsPopup } from './components/HighlightOptionsPopup';
import { HighlightRenderer } from './components/HighlightRenderer';
import { usePdfHighlights, PdfHighlight } from './hooks/usePdfHighlights';
import { convertPosition } from './utils/highlightUtils';

interface SimplePdfHighlighterProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const SimplePdfHighlighter: React.FC<SimplePdfHighlighterProps> = ({
  file,
  url,
  selectedColor = '#ffeb3b',
  isHighlighter = true
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const scrollViewerRef = useRef<any>(null);
  const { toast } = useToast();
  
  // Use our custom hook for highlights management
  const {
    highlights,
    selectedHighlight,
    setSelectedHighlight,
    removeHighlight,
    updateHighlightColor,
    handleSelectionFinished
  } = usePdfHighlights(selectedColor);
  
  // Determine the PDF source
  const pdfUrl = file ? URL.createObjectURL(file) : url;
  
  // Clean up object URL when component unmounts or file changes
  React.useEffect(() => {
    return () => {
      if (file && pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [file, pdfUrl]);
  
  // Handle page change
  const changePage = useCallback((offset: number) => {
    setPageNumber(prevPage => {
      const newPage = prevPage + offset;
      return newPage >= 1 && newPage <= numPages ? newPage : prevPage;
    });
  }, [numPages]);
  
  // Handle zoom
  const changeZoom = useCallback((delta: number) => {
    setZoom(prevZoom => {
      const newZoom = prevZoom + delta;
      return newZoom >= 0.5 && newZoom <= 3 ? newZoom : prevZoom;
    });
  }, []);
  
  // Handle document load success
  const handleDocumentLoad = useCallback((totalPages: number) => {
    setNumPages(totalPages);
    setLoading(false);
    
    toast({
      title: "PDF Loaded Successfully",
      description: `Document has ${totalPages} pages`,
    });
  }, [toast]);
  
  // Render the highlight
  const renderHighlight = useCallback(
    (highlight: PdfHighlight, index: number, setTip: any, hideTip: () => void, viewportToScaled: any, screenshot: any, isScrolledTo: boolean) => {
      return (
        <HighlightRenderer
          highlight={highlight}
          index={index}
          isScrolledTo={isScrolledTo}
          selectedColor={selectedColor}
          selectedHighlightId={selectedHighlight?.id ?? null}
          setTip={setTip}
          hideTip={hideTip}
          onHighlightClick={setSelectedHighlight}
        />
      );
    },
    [selectedColor, selectedHighlight, setSelectedHighlight]
  );
  
  // If no PDF source is available, show a message
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
      <PdfHighlightToolbar
        pageNumber={pageNumber}
        numPages={numPages}
        zoom={zoom}
        isHighlighter={isHighlighter}
        selectedColor={selectedColor}
        onPageChange={changePage}
        onZoomChange={changeZoom}
      />
      
      {/* PDF Content with Highlighting */}
      <div className="flex-1 overflow-auto bg-zinc-800">
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center top' }}>
          <PdfLoader 
            url={pdfUrl} 
            beforeLoad={<div className="loading">Loading PDF...</div>}
          >
            {pdfDocument => {
              // Update the number of pages once the document is loaded
              if (numPages === 0 && pdfDocument.numPages) {
                handleDocumentLoad(pdfDocument.numPages);
              }
              
              return (
                <ReactPdfHighlighter
                  pdfDocument={pdfDocument}
                  enableAreaSelection={isHighlighter ? () => true : () => false}
                  onScrollChange={() => setSelectedHighlight(null)}
                  scrollRef={scrollTo => { scrollViewerRef.current = scrollTo; }}
                  onSelectionFinished={handleSelectionFinished}
                  highlightTransform={renderHighlight}
                  highlights={highlights.map(h => ({
                    ...h,
                    position: convertPosition(h.position)
                  }))}
                />
              );
            }}
          </PdfLoader>
        </div>
      </div>
      
      {/* Color selection popup for selected highlight */}
      {selectedHighlight && (
        <HighlightOptionsPopup
          selectedHighlight={selectedHighlight}
          onColorUpdate={updateHighlightColor}
          onDelete={removeHighlight}
          onClose={() => setSelectedHighlight(null)}
        />
      )}
    </div>
  );
};
