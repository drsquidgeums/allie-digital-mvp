
import { useState, useEffect } from 'react';
import WebViewer from '@pdftron/pdfjs-express';
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
        // Initialize WebViewer
        const webViewerInstance = await WebViewer({
          path: '/public', // Path to PDF.js Express assets
          licenseKey: 'demo:1660528915345:7a61525303000000001b55ca42ea9a620e0d8042bbf18d4e3b41bf35e', // Replace with your actual license key
          initialDoc: url || '', // Use URL if available
        }, containerRef.current);

        // Get access to the core API
        const { Core, UI } = webViewerInstance;

        // Set up the UI
        UI.setTheme('dark');
        UI.enableFeatures([UI.Feature.TextSelection]);
        
        // Enable text highlighting
        if (isHighlighter) {
          UI.enableElements(['highlightToolGroupButton']);
          
          // Set the proper tool mode using the document viewer
          const docViewer = Core.documentViewer;
          docViewer.setToolMode(docViewer.getTool('AnnotationCreateTextHighlight'));
          
          // Set the highlight color
          const annotManager = docViewer.getAnnotationManager();
          const colorObj = new Core.Annotations.Color(selectedColor);
          
          // Apply to annotation styles
          annotManager.setAnnotationStyles({
            'TextHighlight': {
              StrokeColor: colorObj,
              StrokeThickness: 1
            }
          });
        }

        // Load file if URL is not provided
        if (file && !url) {
          const fileUrl = URL.createObjectURL(file);
          UI.loadDocument(fileUrl, { filename: file.name });
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
  }, [file, url, isHighlighter, containerRef, toast]);

  // Update color when it changes
  useEffect(() => {
    if (instance && isHighlighter) {
      const { Core } = instance;
      const docViewer = Core.documentViewer;
      const annotManager = docViewer.getAnnotationManager();
      const colorObj = new Core.Annotations.Color(selectedColor);
      
      annotManager.setAnnotationStyles({
        'TextHighlight': {
          StrokeColor: colorObj,
          StrokeThickness: 1
        }
      });
    }
  }, [selectedColor, instance, isHighlighter]);

  return {
    instance,
    isLoading
  };
};
