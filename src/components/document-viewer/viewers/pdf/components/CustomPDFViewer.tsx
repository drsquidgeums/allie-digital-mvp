
import React from 'react';
import { Document, Page } from 'react-pdf';
import { useToast } from '@/hooks/use-toast';
import { HighlightableDocument } from './HighlightableDocument';

interface CustomPDFViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const CustomPDFViewer: React.FC<CustomPDFViewerProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = true
}) => {
  const pdfSource = file ? file : url ? url : null;
  const { toast } = useToast();
  
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    toast({
      title: "PDF Loaded Successfully",
      description: `Document has ${numPages} pages`,
    });
  };
  
  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error);
    toast({
      variant: "destructive",
      title: "Failed to load PDF",
      description: "There was an error loading the document. Please try again.",
    });
  };

  if (!pdfSource) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/20">
        <p className="text-muted-foreground">No document loaded. Please select a PDF file.</p>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      <HighlightableDocument
        file={pdfSource}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
      />
    </div>
  );
};

export default CustomPDFViewer;
