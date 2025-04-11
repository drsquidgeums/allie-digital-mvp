
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
    
    const loadPDFium = async () => {
      try {
        // First dynamically load the PDFium library
        if (typeof window.PDFiumViewer === 'undefined') {
          // Create script element to load PDFium
          const pdfiumScript = document.createElement('script');
          pdfiumScript.src = 'https://cdn.jsdelivr.net/npm/pdfium-viewer@0.4.0/dist/pdfium-viewer.min.js';
          pdfiumScript.async = true;
          
          // Wait for script to load
          await new Promise((resolve, reject) => {
            pdfiumScript.onload = resolve;
            pdfiumScript.onerror = reject;
            document.head.appendChild(pdfiumScript);
          });
          
          console.log('PDFium viewer script loaded successfully');
        }
        
        if (!isMounted || !containerRef.current) return;
        
        // Clear any previous content
        containerRef.current.innerHTML = '';
        
        // Create PDFium viewer container
        const viewer = document.createElement('div');
        viewer.className = 'pdfium-viewer';
        viewer.style.width = '100%';
        viewer.style.height = '100%';
        containerRef.current.appendChild(viewer);
        
        // Check again after script loading if PDFiumViewer is available
        if (typeof window.PDFiumViewer === 'undefined') {
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
        
        // Initialize PDFium viewer
        const pdfViewer = new window.PDFiumViewer({
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
        
        if (isMounted) {
          setIsLoading(false);
          setError(null);
          
          toast({
            title: "PDF Loaded Successfully",
            description: "Document has been loaded with PDFium Viewer",
          });
        }
      } catch (err) {
        console.error('PDFium viewer error:', err);
        const error = err instanceof Error ? err : new Error('Failed to load PDF');
        
        if (isMounted) {
          setError(error);
          setIsLoading(false);
          if (onError) onError(error);
          
          toast({
            variant: "destructive",
            title: "Failed to load PDF",
            description: error.message || "There was an error loading the document.",
          });
        }
      }
    };
    
    loadPDFium();
    
    return () => {
      isMounted = false;
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
