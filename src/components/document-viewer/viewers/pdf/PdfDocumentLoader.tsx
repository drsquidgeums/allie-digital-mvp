
import React, { useRef } from 'react';
import { 
  PdfLoader, 
  PdfHighlighter, 
  IHighlight,
  Tip
} from 'react-pdf-highlighter';
import { HighlightRenderer } from './HighlightRenderer';

interface PdfDocumentLoaderProps {
  url: string;
  highlights: IHighlight[];
  selectedHighlight: IHighlight | null;
  selectedColor: string;
  isHighlighter: boolean;
  setSelectedHighlight: (highlight: IHighlight | null) => void;
  onSelectionFinished: (
    position: any,
    content: { text?: string; image?: string },
    hideTip: () => void,
    transformSelection: () => void
  ) => null | undefined;
}

export const PdfDocumentLoader: React.FC<PdfDocumentLoaderProps> = ({
  url,
  highlights,
  selectedHighlight,
  selectedColor,
  isHighlighter,
  setSelectedHighlight,
  onSelectionFinished
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Transform the highlight format to match the expected structure
  const transformHighlights = (highlights: IHighlight[]): any[] => {
    return highlights.map(highlight => {
      // Create a deep copy to avoid mutating the original
      const transformedHighlight = JSON.parse(JSON.stringify(highlight));
      
      if (transformedHighlight.position && transformedHighlight.position.boundingRect) {
        // Add the required left and top properties
        transformedHighlight.position.boundingRect = {
          ...transformedHighlight.position.boundingRect,
          // Use width/height directly if x/y are not available
          left: transformedHighlight.position.boundingRect.left || 0,
          top: transformedHighlight.position.boundingRect.top || 0,
          right: transformedHighlight.position.boundingRect.right || 
                 (transformedHighlight.position.boundingRect.left || 0) + 
                 (transformedHighlight.position.boundingRect.width || 0),
          bottom: transformedHighlight.position.boundingRect.bottom || 
                  (transformedHighlight.position.boundingRect.top || 0) + 
                  (transformedHighlight.position.boundingRect.height || 0)
        };
      }
      
      // Transform each rect in the rects array
      if (transformedHighlight.position && transformedHighlight.position.rects) {
        transformedHighlight.position.rects = transformedHighlight.position.rects.map((rect: any) => ({
          ...rect,
          left: rect.left || 0,
          top: rect.top || 0,
          right: rect.right || (rect.left || 0) + (rect.width || 0),
          bottom: rect.bottom || (rect.top || 0) + (rect.height || 0)
        }));
      }
      
      return transformedHighlight;
    });
  };

  const transformedHighlights = transformHighlights(highlights);

  return (
    <div className="flex-1 overflow-auto bg-gray-100" ref={containerRef}>
      <div className="pdf-container p-4">
        <PdfLoader url={url} beforeLoad={<div>Loading PDF...</div>}>
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={() => false}
              highlightTransform={(
                highlight, 
                index, 
                setTip, 
                hideTip,
                viewportToScaled,
                screenshot,
                isScrolledTo
              ) => {
                const isSelected = selectedHighlight?.id === highlight.id;
                
                return (
                  <HighlightRenderer
                    highlight={highlight}
                    index={index}
                    isScrolledTo={isScrolledTo}
                    selectedColor={selectedColor}
                    isSelected={isSelected}
                    onHighlightClick={() => setSelectedHighlight(highlight)}
                    onHighlightMouseOver={(highlight) => {
                      if (highlight.content && highlight.content.text) {
                        setTip(highlight, () => (
                          <div className="highlight-tooltip">
                            {highlight.content.text}
                          </div>
                        ));
                      }
                      setSelectedHighlight(highlight);
                    }}
                    onHighlightMouseOut={() => {
                      hideTip();
                      setSelectedHighlight(null);
                    }}
                  />
                );
              }}
              onScrollChange={() => {
                setSelectedHighlight(null);
              }}
              scrollRef={(scrollTo) => {
                // Store the scrollTo function or implement scrolling logic here
              }}
              onSelectionFinished={onSelectionFinished}
              highlights={transformedHighlights}
            />
          )}
        </PdfLoader>
      </div>
    </div>
  );
};
