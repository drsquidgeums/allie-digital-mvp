
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Highlighter,
  Trash2
} from 'lucide-react';
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

// Extended interface for highlights
interface HighlightItem {
  id: string;
  content: {
    text?: string;
    image?: string;
  };
  position: {
    boundingRect: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
      height: number;
    };
    rects: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
      height: number;
    }[];
    pageNumber: number;
  };
  comment: {
    text: string;
    emoji?: string;
  };
  color?: string;
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
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);
  const { toast } = useToast();

  // File source determination
  const pdfUrl = file ? URL.createObjectURL(file) : url;
  
  useEffect(() => {
    // Clean up object URL when component unmounts or file changes
    return () => {
      if (file && pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [file, pdfUrl]);

  const addHighlight = (highlight: Omit<HighlightItem, 'color'>) => {
    console.log("Adding highlight:", highlight);
    const newHighlight = {
      ...highlight,
      color: selectedColor,
    } as HighlightItem;
    
    setHighlights(prev => [...prev, newHighlight]);
    
    toast({
      title: "Highlight Added",
      description: "Text has been highlighted in the document",
    });
  };

  const updateHighlight = (highlightId: string, color: string) => {
    setHighlights(prev => 
      prev.map(h => h.id === highlightId ? { ...h, color } : h)
    );
  };

  const deleteHighlight = (highlightId: string) => {
    setHighlights(prev => prev.filter(h => h.id !== highlightId));
    setSelectedHighlightId(null);
    
    toast({
      title: "Highlight Removed",
      description: "The highlight has been removed from the document",
    });
  };

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

  // Handle text selection
  const handleTextSelect = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') return;
    
    // Create a simple highlight object
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const container = document.querySelector('.pdf-container');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    
    const highlight: Omit<HighlightItem, 'color'> = {
      id: `highlight-${Date.now()}`,
      content: { text: selection.toString() },
      position: {
        boundingRect: {
          x1: rect.left - containerRect.left,
          y1: rect.top - containerRect.top,
          x2: rect.right - containerRect.left,
          y2: rect.bottom - containerRect.top,
          width: rect.width,
          height: rect.height
        },
        rects: [{
          x1: rect.left - containerRect.left,
          y1: rect.top - containerRect.top,
          x2: rect.right - containerRect.left,
          y2: rect.bottom - containerRect.top,
          width: rect.width,
          height: rect.height
        }],
        pageNumber: pageNumber
      },
      comment: { text: '' }
    };
    
    addHighlight(highlight);
    selection.removeAllRanges();
  };

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
          <Button variant="outline" size="sm" onClick={() => zoom(-0.1)}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          
          <Button variant="outline" size="sm" onClick={() => zoom(0.1)}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            style={{ 
              backgroundColor: isHighlighter ? selectedColor : 'transparent',
              color: isHighlighter ? getContrastColor(selectedColor) : 'currentColor'
            }}
            onClick={handleTextSelect}
          >
            <Highlighter className="h-4 w-4" />
          </Button>
          
          {selectedHighlightId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectedHighlightId && deleteHighlight(selectedHighlightId)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* PDF Document */}
      <div 
        className="flex-1 overflow-auto flex justify-center bg-zinc-800"
        style={{ 
          transformOrigin: 'center top'
        }}
      >
        <div className="pdf-container relative" style={{ transform: `scale(${scale})` }}>
          {pdfUrl && (
            <Document
              file={pdfUrl}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
                console.log("Document loaded with", numPages, "pages");
              }}
              loading={<div className="loading">Loading document...</div>}
              error={<div className="error">Failed to load document</div>}
            >
              <Page 
                pageNumber={pageNumber} 
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
              
              {/* Custom highlight overlay */}
              <div className="highlights-layer absolute top-0 left-0 w-full h-full pointer-events-none">
                {highlights
                  .filter(h => h.position.pageNumber === pageNumber)
                  .map(highlight => (
                    <div
                      key={highlight.id}
                      className="highlight-item pointer-events-auto"
                      style={{
                        position: 'absolute',
                        left: `${highlight.position.boundingRect.x1}px`,
                        top: `${highlight.position.boundingRect.y1}px`,
                        width: `${highlight.position.boundingRect.width}px`,
                        height: `${highlight.position.boundingRect.height}px`,
                        backgroundColor: `${highlight.color}80`, // 50% opacity
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedHighlightId(
                        selectedHighlightId === highlight.id ? null : highlight.id
                      )}
                    >
                      {highlight.content.text && (
                        <div className="highlight-tooltip opacity-0 hover:opacity-100 absolute bottom-full bg-white p-2 rounded shadow-md text-sm">
                          {highlight.content.text}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </Document>
          )}
        </div>
      </div>
      
      {/* Color selection popup for selected highlight */}
      {selectedHighlightId && (
        <div className="absolute bottom-4 right-4 bg-white p-4 rounded shadow-lg z-50">
          <h3 className="text-sm font-medium mb-2">Highlight Color</h3>
          <div className="flex flex-wrap gap-2">
            {["#FFFF00", "#FF9900", "#FF0000", "#00FF00", "#00FFFF", "#0000FF", "#9b87f5", "#FEC6A1"].map(color => (
              <button 
                key={color} 
                style={{
                  backgroundColor: color,
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: "1px solid #ccc"
                }}
                onClick={() => {
                  updateHighlight(selectedHighlightId, color);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Function to determine text color based on background color
function getContrastColor(hexColor: string): string {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
