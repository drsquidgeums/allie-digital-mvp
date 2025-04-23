import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePspdfkitInstance } from './hooks/usePspdfkitInstance';
import PspdfkitErrorFallback from './components/PspdfkitErrorFallback';
import { PdfToolbar } from './components/PdfToolbar';

interface PspdfkitViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
  highlightEnabled?: boolean;
  setHighlightEnabled?: (enabled: boolean) => void;
}

export const PspdfkitViewer: React.FC<PspdfkitViewerProps> = ({
  file,
  url,
  selectedColor = '#FFFF00',
  isHighlighter = true,
  highlightEnabled = false,
  setHighlightEnabled = () => {},
}) => {
  const { toast } = useToast();
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isTextSelected, setIsTextSelected] = useState(false);

  const { containerRef, instance, sdkError } = usePspdfkitInstance({
    file,
    url,
    onReady: (inst) => {
      setNumPages(inst.totalPageCount);
      setPageNumber(inst.viewState.currentPageIndex + 1);

      inst.addEventListener('viewState.currentPageIndex.change', (pageIndex: number) => {
        setPageNumber(pageIndex + 1);
      });
      inst.addEventListener('viewState.zoom.change', (newZoom: number) => {
        setZoom(newZoom);
      });
      inst.addEventListener('textSelection.change', (textSelection: any) => {
        setIsTextSelected(textSelection && !textSelection.isEmpty);
      });

      toast({
        title: "PDF loaded successfully",
        description: `Document has ${inst.totalPageCount} pages`,
      });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "PDF Loading Error",
        description: err instanceof Error ? err.message : "Failed to load PDF viewer",
      });
    }
  });

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
        const selectedText = textSelection.toString();
        
        const annotation = new instance.constructor.Annotations.HighlightAnnotation({
          pageIndex: instance.viewState.currentPageIndex,
          rects: textSelection.rects,
          color: new instance.constructor.Color(selectedColor),
        });
        
        instance.createAnnotation(annotation);
        
        instance.textSelection.clear();
        
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
      instance.setToolMode(instance.constructor.ToolMode.TEXT_HIGHLIGHTER);
    } else {
      instance.setToolMode(instance.constructor.ToolMode.TEXT_SELECTION);
    }
    
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

  if (sdkError) return <PspdfkitErrorFallback error={sdkError} />;

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
        {!instance && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PspdfkitViewer;
