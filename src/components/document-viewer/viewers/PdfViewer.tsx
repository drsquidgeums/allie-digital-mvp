
import React, { useEffect, useRef, useState } from 'react';
import { usePdfRenderer } from './pdf/usePdfRenderer';
import { Document, Page, pdfjs } from 'react-pdf';
import { PdfControls } from './pdf/PdfControls';
import { LoadingFallback } from './LoadingFallback';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfData, setPdfData] = useState<string | ArrayBuffer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load PDF file or URL
  useEffect(() => {
    const loadPdf = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPdfData(e.target?.result || null);
            setLoading(false);
          };
          reader.onerror = () => {
            setError("Failed to read PDF file");
            setLoading(false);
          };
          reader.readAsArrayBuffer(file);
        } else if (url) {
          setPdfData(url);
          setLoading(false);
        } else {
          setPdfData(null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError("Failed to load PDF");
        setLoading(false);
      }
    };

    loadPdf();
  }, [file, url]);

  // Handle document load success
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
    }
  };

  // Handle document load error
  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF document:", error);
    setError("Failed to load PDF document");
    setLoading(false);
  };

  // Handle text selection for highlighting
  const handleTextSelection = () => {
    if (!isHighlighter) return;
    
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    
    if (!selectedText.trim()) return;
    
    // Create highlight element
    const highlightSpan = document.createElement('span');
    highlightSpan.style.backgroundColor = selectedColor || '#ffff00';
    highlightSpan.style.color = 'inherit';
    highlightSpan.className = 'pdf-highlight';
    
    try {
      range.surroundContents(highlightSpan);
      selection.removeAllRanges();
    } catch (e) {
      console.error("Highlighting failed:", e);
    }
  };

  if (loading) {
    return <LoadingFallback />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500 text-center p-4">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" ref={containerRef}>
      <PdfControls
        currentPage={pageNumber}
        totalPages={numPages || 1}
        onPageChange={handlePageChange}
        onHighlight={handleTextSelection}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
      />
      
      <div className="flex-1 overflow-auto p-4 bg-white">
        <div className="mx-auto" style={{ width: 'fit-content' }}>
          {pdfData && (
            <Document
              file={pdfData}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<LoadingFallback />}
              className="shadow-md"
            >
              <Page 
                pageNumber={pageNumber}
                width={600}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="pdf-page"
              />
            </Document>
          )}
        </div>
      </div>
    </div>
  );
};
