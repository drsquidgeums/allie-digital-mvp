
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PdfHighlighter, Highlight, Popup, AreaHighlight } from 'react-pdf-highlighter';
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
import '@/styles/pdf/pdf-highlighter.css';
import '@/styles/pdf/pdf-highlights.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Initialize pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

interface IHighlightContent {
  text?: string;
  image?: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = true
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [selectedHighlight, setSelectedHighlight] = useState<any>(null);
  const { toast } = useToast();
  
  // File source determination for react-pdf-highlighter
  const pdfUrl = file ? URL.createObjectURL(file) : url || "";
  
  useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [file, pdfUrl]);
  
  // PDF load success handler
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    
    toast({
      title: "PDF Loaded Successfully",
      description: `Document has ${numPages} pages`,
    });
    
    console.log("PDF document loaded successfully with", numPages, "pages");
  };
  
  // PDF load error handler
  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error);
    
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

  // Add highlight
  const addHighlight = (highlight: any) => {
    setHighlights([...highlights, highlight]);
    toast({
      title: "Highlight Added",
      description: "Text highlight has been added to the document",
    });
  };

  // Handle selection finish
  const handleSelectionFinished = (
    position: any,
    content: IHighlightContent,
    hideTip: () => void,
    transformSelection: () => void
  ) => {
    addHighlight({
      id: `highlight-${Date.now()}`,
      content,
      position,
      comment: "",
    });
    hideTip();
    transformSelection();
    return null;
  };

  // Set the document background style based on dark theme preference
  const pdfBackgroundStyle = {
    backgroundColor: "#2D3748", // Dark gray background similar to what you described
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
          
          <Button variant="outline" size="sm" onClick={rotateDocument}>
            <RotateCw className="h-4 w-4" />
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            style={{ backgroundColor: isHighlighter ? selectedColor : 'transparent' }}
          >
            <Highlighter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* PDF Document with Highlighter */}
      <div className="flex-1 overflow-auto flex justify-center" style={pdfBackgroundStyle}>
        <div className="pdf-container" style={{ transform: `scale(${scale})`, transformOrigin: 'center top' }}>
          <PdfHighlighter
            url={pdfUrl}
            onScrollChange={() => setSelectedHighlight(null)}
            scrollRef={null}
            onSelectionFinished={handleSelectionFinished}
            highlights={highlights}
            enableAreaSelection={(event) => event.altKey}
            highlightTransform={(highlight, index, setTip, hideTip, viewportToScaled, screenshot, isScrolledTo) => {
              const component = (
                <Highlight
                  key={index}
                  position={highlight.position}
                  onClick={() => setSelectedHighlight(highlight)}
                  onMouseOver={(popupData) => popupData && setTip(highlight, () => popupData)}
                  onMouseOut={hideTip}
                  isScrolledTo={isScrolledTo}
                  comment={highlight.comment}
                />
              );

              return component;
            }}
            pdfDocument={{}}
          />
        </div>
      </div>
      
      {/* Highlight Popup for color selection */}
      {selectedHighlight && (
        <div className="highlight-popup absolute bottom-4 right-4 bg-white p-4 rounded shadow-lg">
          <h3 className="text-sm font-medium mb-2">Highlight Options</h3>
          <div className="flex space-x-2">
            {["#ffeb3b", "#ff9800", "#f44336", "#4caf50", "#2196f3", "#9c27b0"].map(color => (
              <button 
                key={color} 
                style={{
                  backgroundColor: color,
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: selectedColor === color ? "2px solid black" : "none"
                }}
                onClick={() => {
                  // Here you would update the highlight color
                  toast({
                    title: "Color Changed",
                    description: "Highlight color has been updated",
                  });
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
