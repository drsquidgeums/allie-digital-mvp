
import React from 'react';
import PDFiumViewerComponent from '../pdf/PDFiumViewerComponent';
import { useToast } from '@/hooks/use-toast';

interface PdfViewerWrapperProps {
  file: File | null;
  url: string;
  selectedColor?: string;
  isHighlighter?: boolean;
  highlightEnabled?: boolean;
  setHighlightEnabled?: (enabled: boolean) => void;
  setSelectedColor?: (color: string) => void;
}

export const PdfViewerWrapper: React.FC<PdfViewerWrapperProps> = ({
  file,
  url,
  selectedColor = '#FFFF00',
  isHighlighter = true,
  highlightEnabled = false,
  setHighlightEnabled = () => {},
  setSelectedColor = () => {}
}) => {
  const { toast } = useToast();
  
  const handleError = (error: Error) => {
    toast({
      variant: "destructive",
      title: "PDF Viewer Error",
      description: error.message || "Failed to load PDF document"
    });
  };
  
  return (
    <PDFiumViewerComponent 
      file={file} 
      url={url}
      onError={handleError}
    />
  );
};
