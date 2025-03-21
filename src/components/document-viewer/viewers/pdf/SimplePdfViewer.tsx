
import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Highlighter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDocumentHighlights } from './hooks/useDocumentHighlights';
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
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.0);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Get the PDF source from either file or URL
  const pdfSource = file ? file : url;
  
  // Use custom hook for highlight management
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

  // Handle document load success
  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    
    toast({
      title: "PDF Loaded Successfully",
      description: `Document loaded with ${numPages} pages`,
    });
  };

  // Page navigation
  const changePage = (offset: number) => {
    setPageNumber(prevPage => {
      const newPage = prevPage + offset;
      return newPage >= 1 && newPage <= numPages ? newPage : prevPage;
    });
  };

  // Zoom controls
  const changeZoom = (delta: number) => {
    setZoom(prevZoom => {
      const newZoom = prevZoom + delta;
      return newZoom >= 0.5 && newZoom <= 3 ? newZoom : prevZoom;
    });
  };

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
    const highlight = {
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

  // Handle highlight color change
  const handleColorChange = (id: string, color: string) => {
    updateHighlightColor(id, color);
    toast({
      title: "Highlight Updated",
      description: "The highlight color has been changed",
    });
  };

  // Handle highlight deletion
  const handleDeleteHighlight = (id: string) => {
    removeHighlight(id);
    setSelectedHighlightId(null);
    toast({
      title: "Highlight Removed",
      description: "The highlight has been deleted",
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
      <div className="flex items-center justify-between p-2 bg-zinc-800 text-white border-b">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
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
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => changeZoom(-0.1)}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-sm">{Math.round(zoom * 100)}%</span>
          
          <Button variant="outline" size="sm" onClick={() => changeZoom(0.1)}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          {isHighlighter && (
            <Button
              variant="outline"
              size="sm"
              style={{
                backgroundColor: isTextSelected ? selectedColor : 'transparent',
                color: isTextSelected ? getContrastColor(selectedColor) : 'currentColor'
              }}
              onClick={handleTextSelection}
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
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
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {highlights
                .filter(h => h.pageNumber === pageNumber)
                .map(highlight => (
                  <div
                    key={highlight.id}
                    className="highlight-area"
                    style={{
                      top: highlight.position.top,
                      left: highlight.position.left,
                      width: highlight.position.width,
                      height: highlight.position.height,
                      backgroundColor: `${highlight.color}80`, // 50% opacity
                      boxShadow: selectedHighlightId === highlight.id ? '0 0 0 2px #000' : 'none'
                    }}
                    onClick={() => setSelectedHighlightId(
                      selectedHighlightId === highlight.id ? null : highlight.id
                    )}
                  />
                ))}
            </div>
          </Document>
        </div>
      </div>
      
      {/* Highlight Options Popup */}
      {selectedHighlightId && getHighlightById(selectedHighlightId) && (
        <div className="absolute bottom-4 right-4 bg-white p-4 rounded shadow-lg z-50">
          <h3 className="text-sm font-medium mb-2">Highlight Options</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {["#ffeb3b", "#ff9800", "#f44336", "#4caf50", "#2196f3", "#9c27b0"].map(color => (
              <button 
                key={color} 
                style={{
                  backgroundColor: color,
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: "1px solid #ccc"
                }}
                onClick={() => handleColorChange(selectedHighlightId, color)}
              />
            ))}
          </div>
          <div className="flex justify-between">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteHighlight(selectedHighlightId)}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedHighlightId(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to determine text color based on background color
function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export default SimplePdfViewer;
