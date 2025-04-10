
import React from 'react';
import { PdfViewerWrapper } from './file-viewers/PdfViewerWrapper';
import { useToast } from '@/hooks/use-toast';
import { useHighlightUtils } from '@/hooks/document-viewer/useHighlightUtils';

interface PdfViewerProps {
  file: File | null;
  url: string;
  selectedColor?: string;
  isHighlighter?: boolean;
}

/**
 * PDF Viewer Component
 * 
 * Renders PDFs using PDFium viewer
 */
export const PdfViewer: React.FC<PdfViewerProps> = ({ 
  file, 
  url,
  selectedColor = '#FFFF00',
  isHighlighter = true
}) => {
  const { toast } = useToast();
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
    />
  );
};

export default PdfViewer;
