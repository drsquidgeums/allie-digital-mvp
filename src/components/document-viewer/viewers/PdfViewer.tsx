import React from 'react';
import { usePdfViewer } from './pdf/usePdfViewer';
import { PdfControls } from './pdf/PdfControls';
import { PdfLoadingSpinner } from './pdf/PdfLoadingSpinner';
import { PdfCanvas } from './pdf/PdfCanvas';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';

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
  const {
    canvasRef,
    pdf,
    currentPage,
    isLoading,
    handlePageChange,
    handleHighlight
  } = usePdfViewer(file, url, isHighlighter);

  if (isLoading) {
    return <PdfLoadingSpinner />;
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <PdfControls
        currentPage={currentPage}
        totalPages={pdf?.numPages || 1}
        onPageChange={handlePageChange}
        onHighlight={handleHighlight}
        isHighlighter={isHighlighter}
        selectedColor={selectedColor}
      />
      <PdfCanvas canvasRef={canvasRef} />
    </div>
  );
};