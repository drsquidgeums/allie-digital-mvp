
import React from 'react';
import { PdfViewerWrapper } from './file-viewers/PdfViewerWrapper';
import { useToast } from '@/hooks/use-toast';
import { pdfjs } from 'react-pdf';

// Ensure PDF.js worker is configured properly here as well
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
      selectedColor={selectedColor}
      isHighlighter={isHighlighter}
    />
  );
};

export default PdfViewer;
