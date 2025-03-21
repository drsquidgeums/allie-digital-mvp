
import React, { useState, useRef, useCallback } from 'react';
import { 
  PdfLoader, 
  PdfHighlighter as ReactPdfHighlighter, 
  Tip, 
  Highlight, 
  Popup, 
  AreaHighlight,
  IHighlight,
  Position as RPPosition,
  ScaledPosition
} from 'react-pdf-highlighter';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Highlighter as HighlighterIcon
} from 'lucide-react';
import '@/styles/pdf/pdf-highlights.css';

interface SimplePdfHighlighterProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

// Extend the IHighlight interface to include color property
interface PdfHighlight extends IHighlight {
  color?: string;
}

// Position adapter to convert between different position formats
const convertPosition = (position: any): any => {
  // Ensure the position has all required properties
  if (position.boundingRect) {
    // Add x1, y1, x2, y2 if they don't exist but left, top, right, bottom do
    if (!position.boundingRect.x1 && position.boundingRect.left !== undefined) {
      position.boundingRect.x1 = position.boundingRect.left;
      position.boundingRect.y1 = position.boundingRect.top;
      position.boundingRect.x2 = position.boundingRect.right;
      position.boundingRect.y2 = position.boundingRect.bottom;
    }
    
    // Add left, top, right, bottom if they don't exist but x1, y1, x2, y2 do
    if (!position.boundingRect.left && position.boundingRect.x1 !== undefined) {
      position.boundingRect.left = position.boundingRect.x1;
      position.boundingRect.top = position.boundingRect.y1;
      position.boundingRect.right = position.boundingRect.x2;
      position.boundingRect.bottom = position.boundingRect.y2;
    }
    
    // Add width and height if missing
    if (!position.boundingRect.width) {
      position.boundingRect.width = 
        position.boundingRect.right - position.boundingRect.left;
    }
    if (!position.boundingRect.height) {
      position.boundingRect.height = 
        position.boundingRect.bottom - position.boundingRect.top;
    }
  }
  
  // Handle rects array similarly
  if (position.rects && Array.isArray(position.rects)) {
    position.rects = position.rects.map((rect: any) => {
      // Copy x1, y1, x2, y2 to left, top, right, bottom if needed
      if (!rect.left && rect.x1 !== undefined) {
        rect.left = rect.x1;
        rect.top = rect.y1;
        rect.right = rect.x2;
        rect.bottom = rect.y2;
      }
      
      // Copy left, top, right, bottom to x1, y1, x2, y2 if needed
      if (!rect.x1 && rect.left !== undefined) {
        rect.x1 = rect.left;
        rect.y1 = rect.top;
        rect.x2 = rect.right;
        rect.y2 = rect.bottom;
      }
      
      // Add width and height if missing
      if (!rect.width) {
        rect.width = rect.right - rect.left;
      }
      if (!rect.height) {
        rect.height = rect.bottom - rect.top;
      }
      
      return rect;
    });
  }
  
  return position;
};

export const SimplePdfHighlighter: React.FC<SimplePdfHighlighterProps> = ({
  file,
  url,
  selectedColor = '#ffeb3b',
  isHighlighter = true
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [highlights, setHighlights] = useState<PdfHighlight[]>([]);
  const [zoom, setZoom] = useState<number>(1.0);
  const [selectedHighlight, setSelectedHighlight] = useState<PdfHighlight | null>(null);
  const scrollViewerRef = useRef<any>(null);
  const { toast } = useToast();
  
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
  
  // Add highlight
  const addHighlight = useCallback((highlight: PdfHighlight) => {
    const newHighlight = {
      ...highlight,
      color: selectedColor
    };
    
    setHighlights(prev => [...prev, newHighlight]);
    toast({
      title: "Highlight Added",
      description: "Text highlight has been added to the document",
    });
    
    return newHighlight;
  }, [selectedColor, toast]);
  
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
  
  // Handle selection finish (when user highlights text)
  const handleSelectionFinished = useCallback(
    (position: ScaledPosition, content: { text?: string; image?: string }, hideTip: () => void, transformSelection: () => void) => {
      // Create the highlight object
      const highlight = {
        id: `highlight-${Date.now()}`,
        position: convertPosition(position),
        content,
        comment: {
          text: content.text || "",
          emoji: "💬"
        },
        color: selectedColor
      };
      
      // Add the highlight
      addHighlight(highlight as PdfHighlight);
      
      // Hide tip and clear selection
      hideTip();
      if (transformSelection) transformSelection();
      
      // Must return null to make TypeScript happy
      return null;
    },
    [addHighlight, selectedColor]
  );
  
  // Remove a highlight
  const removeHighlight = useCallback((id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
    setSelectedHighlight(null);
    
    toast({
      title: "Highlight Removed",
      description: "The highlight has been removed from the document",
    });
  }, [toast]);
  
  // Update a highlight's color
  const updateHighlightColor = useCallback((id: string, color: string) => {
    setHighlights(prev => 
      prev.map(h => h.id === id ? { ...h, color } : h)
    );
    
    toast({
      title: "Color Updated",
      description: "Highlight color has been changed",
    });
  }, [toast]);
  
  // Render the highlight
  const renderHighlight = useCallback(
    (highlight: PdfHighlight, index: number, setTip: any, hideTip: () => void, viewportToScaled: any, screenshot: any, isScrolledTo: boolean) => {
      const isSelected = selectedHighlight?.id === highlight.id;
      const highlightColor = highlight.color || selectedColor;
      
      // Create a unique class for this highlight
      const highlightClass = `highlight-${index}-${highlight.id?.replace(/\W/g, '-')}`;
      
      // Insert a style element for this highlight
      const styleId = `highlight-style-${index}-${highlight.id}`;
      if (!document.getElementById(styleId)) {
        const styleEl = document.createElement('style');
        styleEl.id = styleId;
        styleEl.innerHTML = `
          .${highlightClass} .Highlight__part {
            background-color: ${highlightColor} !important;
          }
        `;
        document.head.appendChild(styleEl);
      }
      
      // Convert position to ensure compatibility
      const adaptedPosition = convertPosition(highlight.position);
      
      return (
        <div 
          className={highlightClass}
          data-testid={`highlight-${index}`}
          data-highlight-id={highlight.id}
        >
          <Highlight
            isScrolledTo={isScrolledTo}
            position={adaptedPosition}
            comment={highlight.comment}
            onClick={() => setSelectedHighlight(highlight)}
            onMouseOver={() => {
              if (highlight.content && highlight.content.text) {
                setTip(highlight, () => (
                  <div className="highlight-tooltip bg-white p-2 rounded shadow-md">
                    {highlight.content.text}
                  </div>
                ));
              }
            }}
            onMouseOut={hideTip}
          />
        </div>
      );
    },
    [selectedColor, selectedHighlight]
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
          
          <Button
            variant="outline"
            size="sm"
            style={{
              backgroundColor: isHighlighter ? selectedColor : 'transparent',
              color: isHighlighter ? (getLuminance(selectedColor) > 0.5 ? '#000' : '#fff') : 'currentColor'
            }}
          >
            <HighlighterIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* PDF Content with Highlighting */}
      <div className="flex-1 overflow-auto bg-zinc-800">
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center top' }}>
          <PdfLoader url={pdfUrl} beforeLoad={<div className="loading">Loading PDF...</div>}>
            {pdfDocument => (
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
                onLoadSuccess={({ numPages }) => {
                  setNumPages(numPages);
                  toast({
                    title: "PDF Loaded Successfully",
                    description: `Document has ${numPages} pages`,
                  });
                }}
              />
            )}
          </PdfLoader>
        </div>
      </div>
      
      {/* Color selection popup for selected highlight */}
      {selectedHighlight && (
        <div className="absolute bottom-4 right-4 bg-white p-4 rounded shadow-lg z-50">
          <h3 className="text-sm font-medium mb-2">Highlight Options</h3>
          <div className="flex flex-wrap gap-2">
            {["#ffeb3b", "#ff9800", "#f44336", "#4caf50", "#2196f3", "#9c27b0"].map(color => (
              <button 
                key={color} 
                style={{
                  backgroundColor: color,
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: color === selectedHighlight.color ? "2px solid black" : "1px solid #ccc"
                }}
                onClick={() => updateHighlightColor(selectedHighlight.id, color)}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeHighlight(selectedHighlight.id)}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedHighlight(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to determine text color based on background luminance
function getLuminance(hexColor: string): number {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16) / 255;
  const g = parseInt(hexColor.slice(3, 5), 16) / 255;
  const b = parseInt(hexColor.slice(5, 7), 16) / 255;
  
  // Calculate luminance
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
