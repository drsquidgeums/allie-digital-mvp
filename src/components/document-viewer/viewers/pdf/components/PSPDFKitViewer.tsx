
import React, { useRef, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useHighlightUtils } from '@/hooks/document-viewer/useHighlightUtils';
import 'pspdfkit/dist/pspdfkit.css';

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
  const { notifyHighlightAction } = useHighlightUtils(selectedColor);

  // Load and initialize PSPDFKit
  useEffect(() => {
    const loadPSPDFKit = async () => {
      if (!containerRef.current) return;
      
      // Clean up any existing instance
      if (instance) {
        instance.dispose();
      }

      setIsLoading(true);
      
      try {
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

        // Set up license key if available from environment
        const licenseKey = process.env.PSPDFKIT_LICENSE_KEY || '';
        
        // Initialize PSPDFKit with the container and document
        const pspdfkitInstance = await PSPDFKit.default.load({
          container: containerRef.current,
          document: documentSource,
          baseUrl: '/pspdfkit/',
          licenseKey,
          toolbarItems: [
            { type: 'zoom-out' },
            { type: 'zoom-in' },
            { type: 'spacer' },
            { type: 'annotate' },
            { type: 'highlighter' },
            { type: 'text-highlighter' },
            { type: 'ink' },
            { type: 'text' },
            { type: 'note' },
            { type: 'spacer' },
            { type: 'search' },
            { type: 'document-editor' },
            { type: 'print' }
          ]
        });

        // Set up event listeners for annotations
        pspdfkitInstance.addEventListener('annotations.create', (annotations: any) => {
          if (isHighlighter && annotations && Array.isArray(annotations)) {
            if (annotations.length > 0) {
              const annotation = annotations[0];
              if (annotation.type === 'highlight') {
                notifyHighlightAction('add', { text: annotation.note?.text || '' });
              }
            }
          }
        });

        // Set up event listeners for annotations
        pspdfkitInstance.addEventListener('annotations.update', (annotations: any) => {
          if (isHighlighter && annotations && Array.isArray(annotations)) {
            if (annotations.length > 0) {
              const annotation = annotations[0];
              if (annotation.type === 'highlight') {
                notifyHighlightAction('update');
              }
            }
          }
        });

        // Set up event listeners for annotations
        pspdfkitInstance.addEventListener('annotations.delete', (annotations: any) => {
          if (isHighlighter && annotations && Array.isArray(annotations)) {
            if (annotations.length > 0) {
              const annotation = annotations[0];
              if (annotation.type === 'highlight') {
                notifyHighlightAction('remove');
              }
            }
          }
        });

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
          description: "Failed to load PSPDFKit viewer. Falling back to standard viewer.",
          variant: "destructive",
        });
      }
    };

    loadPSPDFKit();

    return () => {
      if (instance) {
        instance.dispose();
      }
    };
  }, [file, url, toast, instance, isHighlighter, notifyHighlightAction]);

  // Update highlight color when it changes
  useEffect(() => {
    if (instance && isHighlighter) {
      try {
        // Convert hex color to rgba
        const r = parseInt(selectedColor.slice(1, 3), 16);
        const g = parseInt(selectedColor.slice(3, 5), 16);
        const b = parseInt(selectedColor.slice(5, 7), 16);
        
        // Create a PSPDFKit color instance
        const PSPDFKitColor = new instance.constructor.Color({ r, g, b });
        
        // Set the default highlighter color
        instance.setToolbarItems(items => 
          items.map(item => 
            item.type === 'highlighter' ? { ...item, color: PSPDFKitColor } : item
          )
        );
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

export default PSPDFKitViewer;
