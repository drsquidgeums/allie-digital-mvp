
import React, { useRef, useEffect, useState } from 'react';
import PSPDFKit from 'pspdfkit';
import { useToast } from '@/hooks/use-toast';

interface PSPDFKitViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const PSPDFKitViewer: React.FC<PSPDFKitViewerProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [instance, setInstance] = useState<PSPDFKit.Instance | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const loadDocument = async () => {
      setIsLoading(true);
      
      // Clean up any existing instance
      if (instance) {
        instance.dispose();
      }

      try {
        let documentSource: string | Blob;
        
        // Determine document source (file or URL)
        if (file) {
          documentSource = file;
        } else if (url) {
          documentSource = url;
        } else {
          setIsLoading(false);
          return;
        }

        // Load PSPDFKit
        const pspdfkitInstance = await PSPDFKit.load({
          container,
          document: documentSource,
          baseUrl: '/public',
          toolbarItems: [
            { type: 'sidebar-thumbnails' },
            { type: 'sidebar-document-outline' },
            { type: 'highlight-text' },
            { type: 'pan' },
            { type: 'zoom-in' },
            { type: 'zoom-out' },
            { type: 'zoom-mode' },
            { type: 'spacer' },
            { type: 'pager' },
            { type: 'print' },
            { type: 'download' },
          ]
        });

        // Configure highlighting options if needed
        if (isHighlighter) {
          // Convert hex color to rgba
          const r = parseInt(selectedColor.slice(1, 3), 16);
          const g = parseInt(selectedColor.slice(3, 5), 16);
          const b = parseInt(selectedColor.slice(5, 7), 16);
          
          // Set the default annotation color
          pspdfkitInstance.setAnnotationPresets({
            'highlight': {
              color: new PSPDFKit.Color({ r, g, b })
            }
          });
        }

        setInstance(pspdfkitInstance);
        setIsLoading(false);
        
        toast({
          title: "PDF loaded",
          description: "Your PDF document has been loaded successfully.",
          duration: 3000,
        });
      } catch (error) {
        console.error('Error initializing PSPDFKit:', error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to load PDF viewer",
          variant: "destructive",
        });
      }
    };

    loadDocument();

    // Clean up on unmount
    return () => {
      if (instance) {
        instance.dispose();
      }
    };
  }, [file, url, isHighlighter, selectedColor, toast]);

  // Update color when it changes
  useEffect(() => {
    if (instance && isHighlighter) {
      try {
        // Convert hex color to rgba
        const r = parseInt(selectedColor.slice(1, 3), 16);
        const g = parseInt(selectedColor.slice(3, 5), 16);
        const b = parseInt(selectedColor.slice(5, 7), 16);
        
        // Update the default highlight color
        instance.setAnnotationPresets({
          'highlight': {
            color: new PSPDFKit.Color({ r, g, b })
          }
        });
      } catch (error) {
        console.error('Error updating highlight color:', error);
      }
    }
  }, [selectedColor, instance, isHighlighter]);

  return (
    <div className="relative flex-1 overflow-auto">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      <div 
        ref={containerRef} 
        className="h-full w-full"
        style={{ minHeight: "500px" }}
      />
    </div>
  );
};
