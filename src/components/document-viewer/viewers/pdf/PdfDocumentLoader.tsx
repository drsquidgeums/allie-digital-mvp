
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
                        // Create the tooltip content first
                        const tipNode = (
                          <div className="highlight-tooltip">
                            {highlight.content.text}
                          </div>
                        );
                        
                        // Call setTip with highlight and callback function
                        setTip(highlight, () => tipNode);
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
              highlights={highlights}
            />
          )}
        </PdfLoader>
      </div>
    </div>
  );
};
