import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import usePspdfKit from '@/components/document-viewer/hooks/usePspdfKit';
import { PdfToolbar } from './components/PdfToolbar';

interface PspdfkitViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
  highlightEnabled?: boolean;
  setHighlightEnabled?: (enabled: boolean) => void;
  setSelectedColor?: (color: string) => void;
}

export const PspdfkitViewer: React.FC<PspdfkitViewerProps> = ({
  file,
  url,
  selectedColor = '#FFFF00',
  isHighlighter = true,
  highlightEnabled = false,
  setHighlightEnabled = () => {},
  setSelectedColor = () => {},
}) => {
  const { isReady, error } = usePspdfKit();
  const [instance, setInstance] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let PSPDFKit: any;
    let pspdfkitInstance: any;

    const loadPdf = async () => {
      try {
        if (!containerRef.current || !isReady) return;

        // Clear container in case it already has content
        containerRef.current.innerHTML = '';

        // Import PSPDFKit dynamically
        PSPDFKit = await import('pspdfkit');

        // Determine source based on file or URL
        let source;
        if (file) {
          const arrayBuffer = await file.arrayBuffer();
          source = { data: new Uint8Array(arrayBuffer) };
        } else if (url) {
          source = { url };
        } else {
          return;
        }

        // Load the PDF document
        pspdfkitInstance = await PSPDFKit.load({
          container: containerRef.current,
          document: source,
          baseUrl: `${window.location.protocol}//${window.location.host}/pspdfkit/`,
          theme: document.documentElement.classList.contains('dark') ? PSPDFKit.Theme.DARK : PSPDFKit.Theme.LIGHT,
          toolbarItems: [
            { type: "sidebar-thumbnails" },
            { type: "sidebar-document-outline" },
            { type: "sidebar-annotations" },
            { type: "text-highlighter" },
          ],
        });

        // Store instance and update page info
        setInstance(pspdfkitInstance);
        setNumPages(pspdfkitInstance.totalPageCount);
        setPageNumber(pspdfkitInstance.viewState.currentPageIndex + 1);
        
        // Listen for page changes
        pspdfkitInstance.addEventListener('viewState.currentPageIndex.change', (pageIndex: number) => {
          setPageNumber(pageIndex + 1);
        });

        // Listen for zoom changes
        pspdfkitInstance.addEventListener('viewState.zoom.change', (newZoom: number) => {
          setZoom(newZoom);
        });

        // Listen for text selection
        pspdfkitInstance.addEventListener('textSelection.change', (textSelection: any) => {
          setIsTextSelected(textSelection && !textSelection.isEmpty);
        });

        toast({
          title: "PDF loaded successfully",
          description: `Document has ${pspdfkitInstance.totalPageCount} pages`,
        });
      } catch (err) {
        console.error('Error loading PSPDFKit:', err);
        toast({
          variant: "destructive",
          title: "PDF Loading Error",
          description: err instanceof Error ? err.message : "Failed to load PDF viewer",
        });
      }
    };

    loadPdf();

    // Cleanup on unmount
    return () => {
      if (instance) {
        instance.dispose();
      }
    };
  }, [file, url, isReady, toast]);

  const handlePageChange = (offset: number) => {
    if (!instance) return;
    
    const newPageIndex = pageNumber + offset - 1;
    if (newPageIndex >= 0 && newPageIndex < numPages) {
      instance.setViewState(viewState => 
        viewState.set('currentPageIndex', newPageIndex)
      );
    }
  };

  const handleZoomChange = (delta: number) => {
    if (!instance) return;
    
    const newZoom = zoom + delta;
    if (newZoom >= 0.5 && newZoom <= 3) {
      instance.setViewState(viewState => 
        viewState.set('zoom', newZoom)
      );
    }
  };

  const handleHighlight = () => {
    if (!instance) return;
    
    try {
      const textSelection = instance.textSelection;
      if (textSelection && !textSelection.isEmpty) {
        // Get the currently selected text
        const selectedText = textSelection.toString();
        
        // Create a highlight annotation
        const annotation = new instance.constructor.Annotations.HighlightAnnotation({
          pageIndex: instance.viewState.currentPageIndex,
          rects: textSelection.rects,
          color: new instance.constructor.Color(selectedColor),
        });
        
        // Add annotation to the document
        instance.createAnnotation(annotation);
        
        // Clear the selection
        instance.textSelection.clear();
        
        // Show success message
        toast({
          title: "Text highlighted",
          description: selectedText.length > 50 
            ? `"${selectedText.substring(0, 50)}..."` 
            : `"${selectedText}"`,
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error highlighting text:', error);
      toast({
        variant: "destructive",
        title: "Highlighting Error",
        description: "Failed to highlight text",
      });
      return false;
    }
  };

  const toggleHighlightMode = () => {
    if (!instance) return;
    
    if (!highlightEnabled) {
      // Enable highlighter tool
      instance.setToolMode(instance.constructor.ToolMode.TEXT_HIGHLIGHTER);
    } else {
      // Switch back to text selection
      instance.setToolMode(instance.constructor.ToolMode.TEXT_SELECTION);
    }
    
    // Update state
    setHighlightEnabled(!highlightEnabled);
    
    toast({
      title: !highlightEnabled ? "Highlight Mode Activated" : "Highlight Mode Deactivated",
      description: !highlightEnabled ? "Select text to highlight it" : "Regular viewing mode"
    });
  };

  const handleKeyboardHelp = () => {
    toast({
      title: "Keyboard Shortcuts",
      description: "Left/Right: Change page, Ctrl+/- Zoom, H: Toggle highlight mode",
    });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="max-w-md p-6 bg-card rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Error Loading PDF Viewer</h3>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <p className="text-sm">Please ensure PSPDFKit is properly installed and configured.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PdfToolbar
        pageNumber={pageNumber}
        numPages={numPages}
        zoom={zoom}
        isTextSelected={isTextSelected}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
        isHighlightMode={highlightEnabled}
        onPageChange={handlePageChange}
        onZoomChange={handleZoomChange}
        onHighlight={handleHighlight}
        onKeyboardHelp={handleKeyboardHelp}
        onToggleHighlight={toggleHighlightMode}
      />
      
      <div 
        ref={containerRef} 
        className="flex-1 relative"
        data-testid="pspdfkit-container"
      >
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PspdfkitViewer;
