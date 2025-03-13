
import React, { useState, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Highlighter
} from 'lucide-react';

interface HighlightableDocumentProps {
  file: { data?: File; url?: string };
  selectedColor: string;
  isHighlighter: boolean;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
}

export const HighlightableDocument: React.FC<HighlightableDocumentProps> = ({
  file,
  selectedColor,
  isHighlighter,
  onLoadSuccess,
  onLoadError
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [highlights, setHighlights] = useState<Array<{id: string, position: DOMRect, color: string, page: number}>>([]);
  const [isHighlightMode, setIsHighlightMode] = useState<boolean>(false);
  const documentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Handle document load success
  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    onLoadSuccess({ numPages });
  };
  
  // Page navigation
  const changePage = (offset: number) => {
    const newPage = pageNumber + offset;
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
    }
  };
  
  // Zoom controls
  const zoom = (factor: number) => {
    const newScale = scale + factor;
    // Limit zoom between 0.5 and 3
    if (newScale >= 0.5 && newScale <= 3) {
      setScale(newScale);
    }
  };
  
  // Rotate document
  const rotateDocument = () => {
    setRotation((rotation + 90) % 360);
  };

  // Toggle highlight mode
  const toggleHighlightMode = () => {
    if (!isHighlighter) return;
    
    setIsHighlightMode(!isHighlightMode);
    toast({
      title: isHighlightMode ? "Highlight mode disabled" : "Highlight mode enabled",
      description: isHighlightMode ? 
        "Click to re-enable highlighting" : 
        "Select text to highlight with the current color",
    });
  };

  // Create highlight from selection
  const createHighlight = () => {
    if (!isHighlightMode || !isHighlighter) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.toString().trim() === '') return;
    
    try {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      if (rect.width === 0 || rect.height === 0) return;
      
      // Create new highlight
      const newHighlight = {
        id: `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        position: rect,
        color: selectedColor,
        page: pageNumber
      };
      
      setHighlights(prev => [...prev, newHighlight]);
      
      // Clear selection
      selection.removeAllRanges();
      
      toast({
        title: "Text highlighted",
        description: "Your selection has been highlighted",
      });
    } catch (error) {
      console.error("Error creating highlight:", error);
    }
  };

  // Add event listener for text selection
  useEffect(() => {
    const handleMouseUp = () => {
      if (isHighlightMode) {
        createHighlight();
      }
    };
    
    if (documentRef.current) {
      documentRef.current.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      if (documentRef.current) {
        documentRef.current.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [isHighlightMode, selectedColor, pageNumber]);

  // Render highlights for current page
  const renderHighlights = () => {
    return highlights
      .filter(h => h.page === pageNumber)
      .map(highlight => (
        <div
          key={highlight.id}
          style={{
            position: 'absolute',
            left: `${highlight.position.left}px`,
            top: `${highlight.position.top}px`,
            width: `${highlight.position.width}px`,
            height: `${highlight.position.height}px`,
            backgroundColor: `${highlight.color}80`, // 50% opacity
            pointerEvents: 'none',
            zIndex: 2,
          }}
          data-highlight-id={highlight.id}
        />
      ));
  };
  
  return (
    <>
      {/* PDF Controls */}
      <div className="flex items-center justify-between p-2 bg-card border-b">
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
          
          <Button variant="outline" size="sm" onClick={rotateDocument}>
            <RotateCw className="h-4 w-4" />
          </Button>
          
          {isHighlighter && (
            <Button 
              variant={isHighlightMode ? "default" : "outline"} 
              size="sm" 
              onClick={toggleHighlightMode}
              className={isHighlightMode ? "bg-primary" : ""}
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* PDF Document */}
      <div 
        className="flex-1 overflow-auto flex justify-center bg-muted/10 p-4 relative"
        ref={documentRef}
      >
        <Document
          file={file}
          onLoadSuccess={handleDocumentLoadSuccess}
          onLoadError={onLoadError}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            rotate={rotation}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg"
          />
          {renderHighlights()}
        </Document>
      </div>
    </>
  );
};
