
import React, { useRef, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import 'pspdfkit/dist/pspdfkit.css';

// Define types for PSPDFKit since it's loaded globally
interface PSPDFKitNamespace {
  Instance: any;
  load(options: PSPDFKitOptions): Promise<any>;
  Color: any;
  [key: string]: any;
}

interface PSPDFKitOptions {
  container: HTMLElement;
  document: string | ArrayBuffer;
  baseUrl: string;
  toolbarItems?: any[];
  [key: string]: any;
}

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
  const [instance, setInstance] = useState<any | null>(null);
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
        // Dynamic import of PSPDFKit
        const PSPDFKit = await import('pspdfkit') as unknown as PSPDFKitNamespace;
        
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

        // Load PSPDFKit
        const pspdfkitInstance = await PSPDFKit.load({
          container,
          document: documentSource,
          baseUrl: '/public',
          toolbarItems: [
            { type: 'sidebar-thumbnails' },
            { type: 'sidebar-document-outline' },
            { type: 'highlighter' }, // Corrected from 'highlight-text'
            { type: 'pan' },
            { type: 'zoom-in' },
            { type: 'zoom-out' },
            { type: 'zoom-mode' },
            { type: 'spacer' },
            { type: 'pager' },
            { type: 'print' }
            // Removed 'download' as it's not a valid type
          ]
        });

        // Configure highlighting options if needed
        if (isHighlighter) {
          // Convert hex color to rgba
          const r = parseInt(selectedColor.slice(1, 3), 16);
          const g = parseInt(selectedColor.slice(3, 5), 16);
          const b = parseInt(selectedColor.slice(5, 7), 16);
          
          // Set the default annotation color
          const PSPDFKitColor = PSPDFKit.Color;
          pspdfkitInstance.setAnnotationPresets({
            'highlight': {
              color: new PSPDFKitColor({ r, g, b })
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
  }, [file, url, isHighlighter, selectedColor, toast, instance]);

  // Update color when it changes
  useEffect(() => {
    const updateHighlightColor = async () => {
      if (instance && isHighlighter) {
        try {
          // Dynamically import PSPDFKit to get the Color constructor
          const PSPDFKit = await import('pspdfkit') as unknown as PSPDFKitNamespace;
          
          // Convert hex color to rgba
          const r = parseInt(selectedColor.slice(1, 3), 16);
          const g = parseInt(selectedColor.slice(3, 5), 16);
          const b = parseInt(selectedColor.slice(5, 7), 16);
          
          // Update the default highlight color
          const PSPDFKitColor = PSPDFKit.Color;
          instance.setAnnotationPresets({
            'highlight': {
              color: new PSPDFKitColor({ r, g, b })
            }
          });
        } catch (error) {
          console.error('Error updating highlight color:', error);
        }
      }
    };
    
    updateHighlightColor();
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
