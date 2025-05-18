
import React from 'react';
import { Highlighter, ZoomIn, ZoomOut, RotateCw, RotateCcw, ChevronLeft, ChevronRight, Hand, MousePointer, Maximize } from 'lucide-react';

interface PdfJsToolbarProps {
  instance: any;
  isHighlighter: boolean;
}

export const PdfJsToolbar: React.FC<PdfJsToolbarProps> = ({ instance, isHighlighter }) => {
  if (!instance) return null;
  
  const { Core, UI } = instance;
  const currentPage = Core.documentViewer.getCurrentPage();
  const pageCount = Core.documentViewer.getPageCount();

  return (
    <div className="bg-muted/30 p-2 border-b flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => UI.setZoomLevel(UI.getZoomLevel() - 0.25)}
          className="p-2 rounded hover:bg-accent text-sm font-medium"
          title="Zoom out"
        >
          <ZoomOut size={16} />
        </button>
        <span className="text-xs">{Math.round((UI.getZoomLevel() || 1) * 100)}%</span>
        <button 
          onClick={() => UI.setZoomLevel(UI.getZoomLevel() + 0.25)}
          className="p-2 rounded hover:bg-accent text-sm font-medium"
          title="Zoom in"
        >
          <ZoomIn size={16} />
        </button>
        <button 
          onClick={() => UI.setFitMode(instance.FitMode.FIT_PAGE)}
          className="p-2 rounded hover:bg-accent text-sm font-medium"
          title="Fit to screen"
        >
          <Maximize size={16} />
        </button>
        <button 
          onClick={() => Core.documentViewer.rotateCounterClockwise()}
          className="p-2 rounded hover:bg-accent text-sm font-medium"
          title="Rotate counterclockwise"
        >
          <RotateCcw size={16} />
        </button>
        <button 
          onClick={() => Core.documentViewer.rotateClockwise()}
          className="p-2 rounded hover:bg-accent text-sm font-medium"
          title="Rotate clockwise"
        >
          <RotateCw size={16} />
        </button>
        <span className="mx-2 border-r border-border h-6"></span>
        <button 
          onClick={() => Core.setToolMode(Core.ToolModes.Pan)}
          className="p-2 rounded hover:bg-accent text-sm font-medium"
          title="Pan tool"
        >
          <Hand size={16} />
        </button>
        <button 
          onClick={() => Core.setToolMode(Core.ToolModes.TextSelect)}
          className="p-2 rounded hover:bg-accent text-sm font-medium"
          title="Text select tool"
        >
          <MousePointer size={16} />
        </button>
        {isHighlighter && (
          <button 
            onClick={() => Core.setToolMode(Core.ToolModes.AnnotationCreateTextHighlight)}
            className="p-2 rounded hover:bg-accent text-sm font-medium"
            title="Highlighter tool"
          >
            <Highlighter size={16} />
          </button>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => Core.documentViewer.previousPage()}
          className="p-2 rounded hover:bg-accent text-sm font-medium"
          title="Previous page"
          disabled={currentPage <= 1}
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-xs">
          Page {currentPage} of {pageCount}
        </span>
        <button 
          onClick={() => Core.documentViewer.nextPage()}
          className="p-2 rounded hover:bg-accent text-sm font-medium"
          title="Next page"
          disabled={currentPage >= pageCount}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
