
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
  const transformHighlights = (highlights: IHighlight[]): IHighlight[] => {
    return highlights.map(highlight => ({
      ...highlight,
      position: {
        ...highlight.position,
        boundingRect: {
          ...highlight.position.boundingRect,
          // Add the missing properties required by the library
          left: highlight.position.boundingRect.x || 0,
          top: highlight.position.boundingRect.y || 0,
        },
        rects: highlight.position.rects.map(rect => ({
          ...rect,
          left: rect.x || 0,
          top: rect.y || 0,
        }))
      }
    }));
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
