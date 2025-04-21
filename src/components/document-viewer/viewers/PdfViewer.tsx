
import React, { useState } from 'react';
import { PdfViewerWrapper } from './file-viewers/PdfViewerWrapper';
import { useToast } from '@/hooks/use-toast';
import { pdfjs } from 'react-pdf';
import { useHighlightUtils } from '@/hooks/document-viewer/useHighlightUtils';

// Ensure PDF.js worker is configured properly 
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  file: File | null;
  url: string;
  selectedColor?: string;
  isHighlighter?: boolean;
}

/**
 * PDF Viewer Component
 * 
 * Renders PDFs using react-pdf library with fallback to native PDF viewer
 */
export const PdfViewer: React.FC<PdfViewerProps> = ({ 
  file, 
  url,
  selectedColor = '#FFFF00',
  isHighlighter = true
}) => {
  const { toast } = useToast();
  const [highlightEnabled, setHighlightEnabled] = useState<boolean>(false);
  const { selectedColor: activeColor, setSelectedColor } = useHighlightUtils(selectedColor);
  
  // Determine source of PDF content
  const source = file || url ? { file, url } : null;
  
  if (!source) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No PDF document provided.</p>
      </div>
    );
  }
  
  return (
    <PdfViewerWrapper 
      file={file} 
      url={url} 
      selectedColor={activeColor}
      isHighlighter={isHighlighter}
      highlightEnabled={highlightEnabled}
      setHighlightEnabled={setHighlightEnabled}
      setSelectedColor={setSelectedColor}
    />
  );
};

export default PdfViewer;
