
import React, { useRef, useState, useEffect } from 'react';
import WebViewer from '@pdftron/webviewer';
import { useToast } from '@/hooks/use-toast';

interface PDFTronViewerContainerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
  onInstanceReady: (instance: any) => void;
}

export const PDFTronViewerContainer: React.FC<PDFTronViewerContainerProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = true,
  onInstanceReady
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Function to initialize the WebViewer
    const initWebViewer = async () => {
      if (!viewerRef.current) return;
      
      setIsLoading(true);
      try {
        // Initialize WebViewer
        const webViewerInstance = await WebViewer({
          path: '/public', // Path to PDFTron assets
          initialDoc: url || '', // Use URL if available
          licenseKey: 'demo:1660528915345:7a61525303000000001b55ca42ea9a620e0d8042bbf18d4e3b41bf35e', // Replace with your actual license key
        }, viewerRef.current);

        // Get access to the core API
        const { Core, UI } = webViewerInstance;

        // Set up the UI
        UI.setTheme('dark');
        UI.enableFeatures([UI.Feature.TextSelection]);
        
        // Enable text highlighting
        if (isHighlighter) {
          UI.enableElements(['highlightToolGroupButton']);
          
          // Fix: Use the correct string value instead of enum for setToolMode
          Core.documentViewer.setToolMode(Core.Tools.ToolNames.HIGHLIGHT);
          
          // Fix: Use the correct structure for annotation styles
          const annotManager = Core.documentViewer.getAnnotationManager();
          const color = new Core.Annotations.Color(selectedColor);
          
          // Set annotation styles with the correct parameters
          annotManager.setAnnotationStyles('TextHighlight', {
            StrokeColor: color
          });
        }

        // Load file if URL is not provided
        if (file && !url) {
          const fileUrl = URL.createObjectURL(file);
          // Fix: Use the correct parameters for loadDocument
          webViewerInstance.UI.loadDocument(fileUrl, { filename: file.name });
        }

        // Notify parent component about the instance
        onInstanceReady(webViewerInstance);
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

    // No cleanup here, we'll handle it in the parent component
  }, [file, url, isHighlighter, selectedColor, toast, onInstanceReady]);

  return (
    <div className="relative flex-1 overflow-auto">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      <div className="h-full w-full" ref={viewerRef}></div>
    </div>
  );
};
