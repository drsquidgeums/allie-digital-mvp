
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UsePdfJsExpressProps {
  containerRef: React.RefObject<HTMLDivElement>;
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter: boolean;
}

export const usePdfJsExpress = ({ 
  containerRef, 
  file, 
  url, 
  selectedColor, 
  isHighlighter 
}: UsePdfJsExpressProps) => {
  const [instance, setInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Function to initialize the WebViewer
    const initWebViewer = async () => {
      if (!containerRef.current) return;
      
      setIsLoading(true);
      try {
        // This function is now redirecting to PSPDFKit
        console.log("PDF.js Express initialization would happen here but we're using PSPDFKit instead");
        
        // Import PSPDFKit dynamically
        const PSPDFKit = await import('pspdfkit');
        
        // Determine document source (file or URL)
        let documentSource: string | ArrayBuffer;
        
        if (file) {
          // Convert File to ArrayBuffer
          const arrayBuffer = await file.arrayBuffer();
          documentSource = arrayBuffer;
        } else if (url) {
          // Use URL directly
          documentSource = url;
        } else {
          setIsLoading(false);
          return;
        }
        
        // Initialize PSPDFKit with the container and document
        const pspdfkitInstance = await PSPDFKit.default.load({
          container: containerRef.current,
          document: documentSource,
          baseUrl: '/pspdfkit/',
        });
        
        setInstance(pspdfkitInstance);
        setIsLoading(false);
        
        // Notify successful loading
        toast({
          title: "PDF viewer initialized",
          description: "Using PSPDFKit to render document.",
          duration: 3000,
        });
      } catch (error) {
        console.error('Error initializing viewer:', error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to load PDF viewer",
          variant: "destructive",
        });
      }
    };

    // Initialize the viewer
    initWebViewer();

    return () => {
      // Cleanup function
      if (instance) {
        try {
          instance.dispose();
        } catch (e) {
          console.error("Error during cleanup:", e);
        }
      }
    };
  }, [file, url, isHighlighter, containerRef, toast]);

  // Update color when it changes
  useEffect(() => {
    if (instance && isHighlighter) {
      try {
        // Convert hex color to rgba
        const r = parseInt(selectedColor.slice(1, 3), 16);
        const g = parseInt(selectedColor.slice(3, 5), 16);
        const b = parseInt(selectedColor.slice(5, 7), 16);
        
        // Create a PSPDFKit color instance and set annotation color
        const PSPDFKitColor = new instance.constructor.Color({ r, g, b });
        instance.setAnnotationToolPreset("highlight", { color: PSPDFKitColor });
        
        console.log("Updating highlight color to:", selectedColor);
      } catch (error) {
        console.error("Error updating highlight color:", error);
      }
    }
  }, [selectedColor, instance, isHighlighter]);

  return {
    instance,
    isLoading
  };
};
