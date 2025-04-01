
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface PdfViewerProps {
  file: File | null;
  url: string;
}

/**
 * PSPDFKit Viewer Component
 * 
 * Renders PDFs using PSPDFKit library
 */
export const PdfViewer: React.FC<PdfViewerProps> = ({ file, url }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [instance, setInstance] = useState<any>(null);
  const { toast } = useToast();

  // Load and initialize PSPDFKit
  useEffect(() => {
    let PSPDFKit: any;
    
    const loadPSPDFKit = async () => {
      try {
        setIsLoading(true);
        
        // Dynamically import PSPDFKit
        PSPDFKit = await import('pspdfkit');
        
        // Clean up previous instance if it exists
        if (instance) {
          instance.dispose();
        }
        
        // Get content source (file or URL)
        let contentSource;
        if (file) {
          contentSource = await file.arrayBuffer();
        } else if (url) {
          contentSource = url;
        } else {
          setIsLoading(false);
          return; // No content to display
        }
        
        // Initialize PSPDFKit with the container
        if (containerRef.current) {
          const newInstance = await PSPDFKit.load({
            container: containerRef.current,
            document: contentSource,
            baseUrl: "/pspdfkit/",
            theme: document.documentElement.classList.contains('dark') ? PSPDFKit.Theme.DARK : PSPDFKit.Theme.LIGHT,
            toolbarItems: [
              { type: "sidebar-thumbnails" },
              { type: "sidebar-annotations" },
              { type: "sidebar-bookmarks" },
              { type: "sidebar-outlines" },
              { type: "pager" },
              { type: "zoom-in" },
              { type: "zoom-out" },
              { type: "zoom-mode" },
              { type: "spacer" },
              { type: "text-highlighter" },
              { type: "ink" },
              { type: "text" },
              { type: "note" },
              { type: "spacer" },
              { type: "pan" },
              { type: "print" },
              { type: "download" }
            ],
            instantJSON: {
              annotations: []
            }
          });
          
          setInstance(newInstance);
          
          toast({
            title: "PDF Loaded",
            description: file ? `Loaded ${file.name}` : "PDF document loaded successfully",
          });
        }
      } catch (error) {
        console.error("PSPDFKit loading error:", error);
        toast({
          variant: "destructive",
          title: "PDF Loading Failed",
          description: "There was a problem loading the PDF. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPSPDFKit();
    
    // Clean up when component unmounts
    return () => {
      if (instance) {
        instance.dispose();
      }
    };
  }, [file, url]);
  
  // Update theme when it changes
  useEffect(() => {
    const handleThemeChange = () => {
      if (instance) {
        const isDark = document.documentElement.classList.contains('dark');
        instance.setViewState(s => s.set('theme', isDark ? 'dark' : 'light'));
      }
    };
    
    // Listen for theme changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          handleThemeChange();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, [instance]);
  
  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="sr-only">Loading PDF...</span>
        </div>
      )}
      <div 
        ref={containerRef} 
        className="h-full w-full"
        data-testid="pspdfkit-container"
        aria-label="PDF document viewer"
      />
    </div>
  );
};

export default PdfViewer;
