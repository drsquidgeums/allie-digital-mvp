
import React from 'react';
import { PdfViewer as PdfViewerComponent } from './pdf/PdfViewer';
import { useToast } from '@/hooks/use-toast';

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
    <PdfViewerComponent 
      file={file} 
      url={url} 
      selectedColor={selectedColor}
      isHighlighter={isHighlighter}
    />
  );
};

export default PdfViewer;
