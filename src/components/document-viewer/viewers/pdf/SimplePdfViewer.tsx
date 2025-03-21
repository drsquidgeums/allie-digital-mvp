
import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useToast } from '@/hooks/use-toast';
import { useDocumentHighlights } from './hooks/useDocumentHighlights';
import { PdfToolbar } from './components/PdfToolbar';
import { HighlightPopup } from './components/HighlightPopup';
import { HighlightLayer, Highlight } from './components/HighlightLayer';
import { usePdfDocumentState } from './hooks/usePdfDocumentState';
import '@/styles/pdf/pdf-base.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set PDF.js worker path
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface SimplePdfViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const SimplePdfViewer: React.FC<SimplePdfViewerProps> = ({
  file,
  url,
  selectedColor = '#ffeb3b',
  isHighlighter = true
}) => {
  const [isTextSelected, setIsTextSelected] = useState(false);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Get the PDF source from either file or URL
  const pdfSource = file ? file : url;
  
  // Use custom hooks for document state and highlights
  const { 
    numPages, 
    pageNumber, 
    zoom, 
    handleDocumentLoadSuccess, 
    changePage, 
    changeZoom 
  } = usePdfDocumentState();
  
  const { 
    highlights, 
    addHighlight, 
    removeHighlight, 
    updateHighlightColor,
    selectedHighlightId, 
    setSelectedHighlightId,
    getHighlightById
  } = useDocumentHighlights(selectedColor);

  // Clean up object URLs when component unmounts or file changes
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [file]);

  // Handle text selection for highlighting
  const handleTextSelection = () => {
    if (!isHighlighter) return;
    
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') {
      setIsTextSelected(false);
      return;
    }
    
    setIsTextSelected(true);
    
    // Create highlight from selection
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    if (!pdfContainerRef.current) return;
    
    const containerRect = pdfContainerRef.current.getBoundingClientRect();
    const selectedText = selection.toString();
    
    // Create a highlight object
    const highlight: Highlight = {
      id: `highlight-${Date.now()}`,
      pageNumber,
      content: selectedText,
      position: {
        top: rect.top - containerRect.top,
        left: rect.left - containerRect.left,
        width: rect.width,
        height: rect.height
      },
      color: selectedColor
    };
    
    // Add the highlight
    addHighlight(highlight);
    
    // Clear the selection
    selection.removeAllRanges();
    setIsTextSelected(false);
    
    toast({
      title: "Text Highlighted",
      description: `"${selectedText.slice(0, 20)}${selectedText.length > 20 ? '...' : ''}" has been highlighted`,
    });
  };

  // If no PDF source is available, show a message
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
      <PdfToolbar
        pageNumber={pageNumber}
        numPages={numPages}
        zoom={zoom}
        isTextSelected={isTextSelected}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
        onPageChange={changePage}
        onZoomChange={changeZoom}
        onHighlight={handleTextSelection}
      />
      
      {/* PDF Content with Highlighting */}
      <div 
        className="flex-1 overflow-auto bg-zinc-800 flex justify-center"
        ref={pdfContainerRef}
      >
        <div 
          style={{ 
            transform: `scale(${zoom})`, 
            transformOrigin: 'center top',
            position: 'relative'
          }}
        >
          <Document
            file={pdfSource}
            onLoadSuccess={handleDocumentLoadSuccess}
            loading={<div className="loading-indicator">Loading PDF...</div>}
            error={<div className="error-message">Failed to load PDF</div>}
          >
            <Page 
              pageNumber={pageNumber} 
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="pdf-page"
              onMouseUp={() => {
                const selection = window.getSelection();
                if (selection && selection.toString().trim() !== '') {
                  setIsTextSelected(true);
                }
              }}
            />

            {/* Render highlights for current page */}
            <HighlightLayer 
              highlights={highlights}
              currentPage={pageNumber}
              selectedHighlightId={selectedHighlightId}
              onHighlightClick={setSelectedHighlightId}
            />
          </Document>
        </div>
      </div>
      
      {/* Highlight Options Popup */}
      {selectedHighlightId && getHighlightById(selectedHighlightId) && (
        <HighlightPopup
          selectedHighlightId={selectedHighlightId}
          onColorChange={updateHighlightColor}
          onDelete={removeHighlight}
          onClose={() => setSelectedHighlightId(null)}
        />
      )}
    </div>
  );
};

export default SimplePdfViewer;
