
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LoadingFallback } from '../LoadingFallback';

interface PDFiumViewerProps {
  file: File | null;
  url: string;
  onError?: (error: Error) => void;
}

/**
 * PDFium Viewer Component
 * 
 * Renders PDFs using PDFium technology for improved performance and support
 */
export const PDFiumViewerComponent: React.FC<PDFiumViewerProps> = ({
  file,
  url,
  onError
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  // Load the PDF document using PDFium
  useEffect(() => {
    let isMounted = true;
    const pdfiumScript = document.createElement('script');
    pdfiumScript.src = 'https://cdn.jsdelivr.net/npm/pdfium-viewer@0.4.0/dist/pdfium-viewer.min.js';
    pdfiumScript.async = true;
    
    pdfiumScript.onload = async () => {
      if (!isMounted) return;
      
      try {
        if (!containerRef.current) return;
        
        // Clear any previous content
        containerRef.current.innerHTML = '';
        
        // Create PDFium viewer instance
        const viewer = document.createElement('div');
        viewer.className = 'pdfium-viewer';
        viewer.style.width = '100%';
        viewer.style.height = '100%';
        containerRef.current.appendChild(viewer);
        
        // Initialize PDFium viewer
        // @ts-ignore - PDFium global variable
        if (typeof PDFiumViewer === 'undefined') {
          throw new Error('PDFium Viewer failed to load');
        }
        
        let pdfSource = url;
        if (file) {
          // Convert File to URL
          pdfSource = URL.createObjectURL(file);
        }
        
        if (!pdfSource) {
          throw new Error('No PDF source provided');
        }
        
        // @ts-ignore - PDFium global variable
        const pdfViewer = new PDFiumViewer({
          container: viewer,
          url: pdfSource,
          scale: 1.0,
          renderType: 'canvas',
        });
        
        await pdfViewer.init();
        
        // Clean up any object URLs we created
        if (file) {
          URL.revokeObjectURL(pdfSource);
        }
        
        setIsLoading(false);
        
        toast({
          title: "PDF Loaded Successfully",
          description: "Document has been loaded with PDFium Viewer",
        });
      } catch (err) {
        console.error('PDFium viewer error:', err);
        const error = err instanceof Error ? err : new Error('Failed to load PDF');
        setError(error);
        if (onError) onError(error);
        
        toast({
          variant: "destructive",
          title: "Failed to load PDF",
          description: error.message || "There was an error loading the document.",
        });
      }
    };
    
    pdfiumScript.onerror = () => {
      if (!isMounted) return;
      const error = new Error('Failed to load PDFium Viewer script');
      setError(error);
      if (onError) onError(error);
      
      toast({
        variant: "destructive",
        title: "Failed to load PDF Viewer",
        description: "Could not load the PDFium Viewer library. Please try again.",
      });
    };
    
    // Add the script to the document
    document.head.appendChild(pdfiumScript);
    
    return () => {
      isMounted = false;
      // Clean up
      document.head.removeChild(pdfiumScript);
    };
  }, [file, url, toast, onError]);
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-destructive">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Error Loading PDF</h3>
          <p>{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      {isLoading && <LoadingFallback />}
      <div 
        ref={containerRef} 
        className="flex-1 overflow-auto"
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
};

export default PDFiumViewerComponent;
