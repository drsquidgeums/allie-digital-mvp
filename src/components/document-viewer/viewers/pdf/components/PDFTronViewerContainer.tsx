
import React, { useEffect, useRef, useState } from 'react';
import WebViewer from '@pdftron/webviewer';

interface PDFTronViewerContainerProps {
  url?: string;
  file?: File;
  selectedColor: string;
  isHighlighter: boolean;
  onContentLoaded?: (content: string, fileName: string) => void;
}

const PDFTronViewerContainer: React.FC<PDFTronViewerContainerProps> = ({
  url,
  file,
  selectedColor,
  isHighlighter,
  onContentLoaded
}) => {
  const viewer = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [documentContent, setDocumentContent] = useState<string>('');

  useEffect(() => {
    if (!viewer.current) return;

    const initializeViewer = async () => {
      // If neither a URL nor a file is provided, don't attempt to initialize the viewer
      if (!url && !file) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Initialize WebViewer with proper configuration
        const webViewerInstance = await WebViewer({
          path: '/public', // Path to PDFTron assets
          initialDoc: url || '', // Use URL if available
        }, viewer.current);

        const { UI, Core } = webViewerInstance;
        
        // If a file is provided, load it instead of the URL
        if (file) {
          const fileReader = new FileReader();
          fileReader.onload = async (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const blob = new Blob([arrayBuffer], { type: file.type });
            await Core.documentViewer.loadDocument(blob, { filename: file.name });
          };
          fileReader.readAsArrayBuffer(file);
        }
        
        if (isHighlighter) {
          UI.enableElements(['highlightToolGroupButton']);
          
          // Set the tool mode to highlight with proper method call
          const docViewer = Core.documentViewer;
          
          // Get annotation manager
          const annotManager = docViewer.getAnnotationManager();
          
          // Parse the selected color to create a proper color object
          const colorObj = new Core.Annotations.Color(selectedColor);
          
          // Use the correct API for PDFTron
          if (docViewer.getTool) {
            // Correctly set the tool mode
            docViewer.setToolMode(Core.Tools.ToolNames.HIGHLIGHT);
            
            // Get the highlight tool
            const highlightTool = docViewer.getTool(Core.Tools.ToolNames.HIGHLIGHT);
            
            // Apply color settings if the tool exists
            if (highlightTool && highlightTool.setStyles) {
              highlightTool.setStyles({
                StrokeColor: colorObj
              });
            }
          }
        }

        // Load file if URL is not provided
        if (!url && file) {
          const reader = new FileReader();
          reader.onload = () => {
            Core.documentViewer.loadDocument(reader.result as ArrayBuffer, { filename: file.name });
          };
          reader.readAsArrayBuffer(file);
        }

        // Extract text when document is loaded
        Core.documentViewer.addEventListener('documentLoaded', async () => {
          try {
            const doc = Core.documentViewer.getDocument();
            
            // Use the correct method to extract text based on PDFTron API
            let textContent = '';
            if (doc.getTextData) {
              const textData = await doc.getTextData();
              textContent = textData.text || '';
            } else {
              // Fallback method
              const pageCount = doc.getPageCount();
              let allText = '';
              for (let i = 1; i <= pageCount; i++) {
                const text = await doc.loadPageText(i);
                allText += text + '\n';
              }
              textContent = allText;
            }
            
            setDocumentContent(textContent);
            
            if (onContentLoaded && textContent) {
              onContentLoaded(textContent, file?.name || url?.split('/').pop() || 'document');
            }
            
            setIsLoading(false);
          } catch (error) {
            console.error('Error extracting text:', error);
            setIsLoading(false);
          }
        });

      } catch (error) {
        console.error('Error initializing WebViewer:', error);
        setIsLoading(false);
      }
    };

    initializeViewer();

    return () => {
      // Clean up
    };
  }, [url, file, isHighlighter, selectedColor, onContentLoaded]);

  return (
    <div className="relative h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
      <div ref={viewer} className="h-full w-full"></div>
    </div>
  );
};

export default PDFTronViewerContainer;
