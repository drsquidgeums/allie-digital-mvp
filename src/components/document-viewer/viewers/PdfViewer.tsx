
import React, { useEffect, useState } from 'react';
import { IHighlight } from 'react-pdf-highlighter';
import { PdfControls } from './pdf/PdfControls';
import { PdfDocumentLoader } from './pdf/PdfDocumentLoader';
import { PdfPagination } from './pdf/PdfPagination';
import { useHighlightManager } from './pdf/useHighlightManager';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import '@/styles/pdf/pdf-base.css';

// Set worker path for PDF.js
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
  
  const {
    highlights,
    selectedHighlight,
    setSelectedHighlight,
    addHighlight,
    scrollToHighlight,
    createNewHighlight
  } = useHighlightManager();
  
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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= numPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSelectionFinished = (
    position: any,
    content: { text?: string; image?: string },
    hideTip: () => void,
    transformSelection: () => void
  ) => {
    if (!isHighlighter) return null;
    
    const newHighlight = createNewHighlight(position, content);
    addHighlight(newHighlight);
    hideTip();
    transformSelection();
    return null;
  };

  if (!pdfDocument) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
      
      <PdfDocumentLoader
        url={pdfDocument}
        highlights={highlights}
        selectedHighlight={selectedHighlight}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
        setSelectedHighlight={setSelectedHighlight}
        onSelectionFinished={handleSelectionFinished}
      />
      
      <PdfPagination
        currentPage={currentPage}
        numPages={numPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
