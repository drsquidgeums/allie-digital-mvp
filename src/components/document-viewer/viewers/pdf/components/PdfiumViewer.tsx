
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LoadingFallback } from '../../LoadingFallback';

interface PdfiumViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
  highlightEnabled?: boolean;
  setHighlightEnabled?: (enabled: boolean) => void;
  setSelectedColor?: (color: string) => void;
}

export const PdfiumViewer: React.FC<PdfiumViewerProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = true,
  highlightEnabled = false,
  setHighlightEnabled = () => {},
  setSelectedColor = () => {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<HTMLObjectElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [pdfSource, setPdfSource] = useState<string>('');
  
  useEffect(() => {
    const loadPdf = async () => {
      try {
        setIsLoading(true);
        
        // Handle File or URL
        if (file) {
          // Create a URL for the file
          const fileUrl = URL.createObjectURL(file);
          setPdfSource(fileUrl);
        } else if (url) {
          setPdfSource(url);
        } else {
          setPdfSource('');
          setIsLoading(false);
          return;
        }
        
        // Cleanup function to revoke URL when component unmounts
        return () => {
          if (file) {
            URL.revokeObjectURL(pdfSource);
          }
        };
      } catch (error) {
        console.error('Error loading PDF:', error);
        toast({
          title: "PDF Loading Error",
          description: "Could not load the PDF file",
          variant: "destructive",
        });
      }
    };
    
    loadPdf();
  }, [file, url, toast]);
  
  const handleLoad = () => {
    setIsLoading(false);
    toast({
      title: "PDF loaded",
      description: "The document has been loaded successfully",
    });
  };
  
  const handleError = () => {
    setIsLoading(false);
    toast({
      title: "Error",
      description: "Failed to load the PDF document",
      variant: "destructive",
    });
  };
  
  // Use different approaches depending on the browser
  const usePdfObject = navigator.userAgent.includes('Chrome') || navigator.userAgent.includes('Edge');
  
  if (!pdfSource) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-muted-foreground">No PDF document provided.</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {isLoading && <LoadingFallback message="Loading PDF..." />}
      
      <div className="flex-1 relative" ref={containerRef}>
        {usePdfObject ? (
          // Use object tag for Chrome/Edge
          <object
            ref={objectRef}
            data={pdfSource}
            type="application/pdf"
            className="w-full h-full"
            onLoad={handleLoad}
            onError={handleError}
          >
            <p>Your browser doesn't support embedded PDFs. <a href={pdfSource} target="_blank" rel="noopener noreferrer">Download the PDF</a> instead.</p>
          </object>
        ) : (
          // Use iframe for other browsers
          <iframe
            ref={iframeRef}
            src={pdfSource}
            className="w-full h-full border-0"
            onLoad={handleLoad}
            onError={handleError}
            title="PDF Viewer"
          >
            <p>Your browser doesn't support embedded PDFs. <a href={pdfSource} target="_blank" rel="noopener noreferrer">Download the PDF</a> instead.</p>
          </iframe>
        )}
      </div>
    </div>
  );
};

export default PdfiumViewer;
