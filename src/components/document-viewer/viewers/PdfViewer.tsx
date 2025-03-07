
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  PdfLoader, 
  PdfHighlighter, 
  Highlight, 
  Popup, 
  Tip,
  IHighlight,
  Position,
  ScaledPosition, 
  LTWHP
} from 'react-pdf-highlighter';
import { PdfControls } from './pdf/PdfControls';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import '@/styles/pdf-viewer.css';

// Set worker path for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Define our highlight type that's compatible with the library's IHighlight
interface HighlightType extends IHighlight {
  id: string;
  content: {
    text?: string;
    image?: string;
  };
  position: {
    boundingRect: LTWHP & {
      pageNumber: number;
    };
    rects: Array<LTWHP & {
      pageNumber: number;
    }>;
    pageNumber: number;
  };
  comment?: string;
}

interface PdfViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pdfDocument, setPdfDocument] = useState<string | null>(null);
  const [scale, setScale] = useState(1.2);
  const [highlights, setHighlights] = useState<HighlightType[]>([]);
  const [selectedHighlight, setSelectedHighlight] = useState<HighlightType | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Convert File to URL or use provided URL
  useEffect(() => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPdfDocument(fileURL);
      return () => {
        URL.revokeObjectURL(fileURL);
      };
    } else if (url) {
      setPdfDocument(url);
    } else {
      setPdfDocument(null);
    }
  }, [file, url]);

  // Handle document loading success
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= numPages) {
      setCurrentPage(newPage);
    }
  };

  // Create new highlight from selection
  const addHighlight = (highlight: HighlightType) => {
    setHighlights([...highlights, highlight]);
  };

  // Get scroll position for highlight scrolling
  const scrollToHighlight = (highlight: HighlightType) => {
    const { pageNumber } = highlight.position;
    setCurrentPage(pageNumber);
    
    // Scroll to position after page change
    setTimeout(() => {
      const highlightElement = document.querySelector(
        `[data-highlight-id="${highlight.id}"]`
      );
      if (highlightElement) {
        highlightElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  };

  // Function to handle setting the tip
  const handleSetTip = (highlight: HighlightType, callback: () => Position) => {
    setSelectedHighlight(highlight);
  };

  // Function to handle hiding the tip
  const handleHideTip = () => {
    setSelectedHighlight(null);
  };

  // Function to handle the scroll change
  const handleScrollChange = () => {
    setSelectedHighlight(null);
  };

  // Function to handle selection finished
  const handleSelectionFinished = (
    position: ScaledPosition,
    content: { text?: string; image?: string },
    hideTip: () => void,
    transformSelection: () => void
  ) => {
    if (!isHighlighter) return null;
    
    const comment = "";
    const newHighlight: HighlightType = {
      id: `highlight_${Date.now()}`,
      content,
      position: {
        ...position,
        boundingRect: {
          ...position.boundingRect,
          pageNumber: position.pageNumber
        },
        rects: position.rects.map(rect => ({
          ...rect,
          pageNumber: position.pageNumber
        }))
      },
      comment
    };
    
    addHighlight(newHighlight);
    hideTip();
    transformSelection();
    return null;
  };

  // Loading state when PDF is not yet available
  if (!pdfDocument) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render PDF with support for highlights
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PdfControls
        currentPage={currentPage}
        totalPages={numPages}
        onPageChange={handlePageChange}
        onHighlight={() => {}}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
      />
      
      <div className="flex-1 overflow-auto bg-gray-100" ref={containerRef}>
        <div className="pdf-container p-4">
          <PdfLoader url={pdfDocument} beforeLoad={<div>Loading PDF...</div>}>
            {(pdfDocument) => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={false}
                highlightTransform={(
                  highlight, 
                  index, 
                  setTip, 
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo
                ) => {
                  const isSelected = selectedHighlight?.id === highlight.id;
                  const highlightColor = isSelected ? "rgba(255, 226, 143, 1)" : selectedColor || "rgba(255, 235, 59, 0.5)";
                  
                  return (
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.comment}
                      key={index}
                      onMouseOver={() => {
                        setTip(highlight.content.text || '', highlight.position);
                        setSelectedHighlight(highlight as HighlightType);
                      }}
                      onMouseOut={() => {
                        hideTip();
                        setSelectedHighlight(null);
                      }}
                      onClick={() => {
                        setSelectedHighlight(highlight as HighlightType);
                      }}
                      style={{ backgroundColor: highlightColor }}
                    />
                  );
                }}
                onScrollChange={handleScrollChange}
                scrollRef={containerRef}
                onSelectionFinished={handleSelectionFinished}
                highlights={highlights as IHighlight[]}
              />
            )}
          </PdfLoader>
        </div>
      </div>
      
      <div className="flex justify-center p-2 border-t">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1 mr-4 bg-gray-200 rounded-full disabled:opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="flex items-center text-sm">
          Page {currentPage} of {numPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= numPages}
          className="p-1 ml-4 bg-gray-200 rounded-full disabled:opacity-50"
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
