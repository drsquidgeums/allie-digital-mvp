
import React, { useEffect, useRef, useState } from 'react';
import WebViewer from '@pdftron/pdfjs-express';
import { useToast } from '@/hooks/use-toast';
import { Highlighter, ZoomIn, ZoomOut, RotateCw, RotateCcw, ChevronLeft, ChevronRight, Hand, MousePointer } from 'lucide-react';

interface PdfJsExpressViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const PdfJsExpressViewer: React.FC<PdfJsExpressViewerProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = true
}) => {
  const viewer = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [instance, setInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Function to initialize the WebViewer
    const initWebViewer = async () => {
      if (!viewer.current) return;
      
      setIsLoading(true);
      try {
        // Initialize WebViewer
        const webViewerInstance = await WebViewer({
          path: '/public', // Path to PDF.js Express assets
          licenseKey: 'demo:1660528915345:7a61525303000000001b55ca42ea9a620e0d8042bbf18d4e3b41bf35e', // Replace with your actual license key
          initialDoc: url || '', // Use URL if available
        }, viewer.current);

        // Get access to the core API
        const { Core, UI } = webViewerInstance;

        // Set up the UI
        UI.setTheme('dark');
        UI.enableFeatures([UI.Feature.TextSelection]);
        
        // Enable text highlighting
        if (isHighlighter) {
          UI.enableElements(['highlightToolGroupButton']);
          Core.setToolMode(Core.ToolModes.AnnotationCreateTextHighlight);
          
          // Set the highlight color
          const annotManager = Core.documentViewer.getAnnotationManager();
          annotManager.setAnnotationStyles({
            'TextHighlight': {
              StrokeColor: new Core.Annotations.Color(selectedColor),
              StrokeThickness: 1
            }
          });
        }

        // Load file if URL is not provided
        if (file && !url) {
          const fileUrl = URL.createObjectURL(file);
          UI.loadDocument(fileUrl);
        }

        // Save instance for further interactions
        setInstance(webViewerInstance);
        setIsLoading(false);
        
        // Notify successful loading
        toast({
          title: "PDF loaded",
          description: "Your PDF document has been loaded successfully.",
          duration: 3000,
        });
      } catch (error) {
        console.error('Error initializing WebViewer:', error);
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

    // Clean up on unmount
    return () => {
      if (instance) {
        instance.UI.dispose();
      }
    };
  }, [file, url, isHighlighter, selectedColor, toast]);

  // Update color when it changes
  useEffect(() => {
    if (instance && isHighlighter) {
      const { Core } = instance;
      const annotManager = Core.documentViewer.getAnnotationManager();
      annotManager.setAnnotationStyles({
        'TextHighlight': {
          StrokeColor: new Core.Annotations.Color(selectedColor),
          StrokeThickness: 1
        }
      });
    }
  }, [selectedColor, instance, isHighlighter]);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-muted/30 p-2 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {instance && (
            <>
              <button 
                onClick={() => instance.UI.setZoomLevel(instance.UI.getZoomLevel() - 0.25)}
                className="p-2 rounded hover:bg-accent text-sm font-medium"
                title="Zoom out"
              >
                <ZoomOut size={16} />
              </button>
              <span className="text-xs">{Math.round((instance.UI.getZoomLevel() || 1) * 100)}%</span>
              <button 
                onClick={() => instance.UI.setZoomLevel(instance.UI.getZoomLevel() + 0.25)}
                className="p-2 rounded hover:bg-accent text-sm font-medium"
                title="Zoom in"
              >
                <ZoomIn size={16} />
              </button>
              <button 
                onClick={() => instance.Core.documentViewer.rotateCounterClockwise()}
                className="p-2 rounded hover:bg-accent text-sm font-medium"
                title="Rotate counterclockwise"
              >
                <RotateCcw size={16} />
              </button>
              <button 
                onClick={() => instance.Core.documentViewer.rotateClockwise()}
                className="p-2 rounded hover:bg-accent text-sm font-medium"
                title="Rotate clockwise"
              >
                <RotateCw size={16} />
              </button>
              <span className="mx-2 border-r border-border h-6"></span>
              <button 
                onClick={() => instance.Core.setToolMode(instance.Core.ToolModes.Pan)}
                className="p-2 rounded hover:bg-accent text-sm font-medium"
                title="Pan tool"
              >
                <Hand size={16} />
              </button>
              <button 
                onClick={() => instance.Core.setToolMode(instance.Core.ToolModes.TextSelect)}
                className="p-2 rounded hover:bg-accent text-sm font-medium"
                title="Text select tool"
              >
                <MousePointer size={16} />
              </button>
              {isHighlighter && (
                <button 
                  onClick={() => instance.Core.setToolMode(instance.Core.ToolModes.AnnotationCreateTextHighlight)}
                  className="p-2 rounded hover:bg-accent text-sm font-medium"
                  title="Highlighter tool"
                >
                  <Highlighter size={16} />
                </button>
              )}
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {instance && (
            <>
              <button 
                onClick={() => instance.Core.documentViewer.previousPage()}
                className="p-2 rounded hover:bg-accent text-sm font-medium"
                title="Previous page"
                disabled={instance.Core.documentViewer.getCurrentPage() <= 1}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs">
                Page {instance.Core.documentViewer.getCurrentPage()} of {instance.Core.documentViewer.getPageCount()}
              </span>
              <button 
                onClick={() => instance.Core.documentViewer.nextPage()}
                className="p-2 rounded hover:bg-accent text-sm font-medium"
                title="Next page"
                disabled={instance.Core.documentViewer.getCurrentPage() >= instance.Core.documentViewer.getPageCount()}
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        <div className="h-full w-full" ref={viewer}></div>
      </div>
    </div>
  );
};
