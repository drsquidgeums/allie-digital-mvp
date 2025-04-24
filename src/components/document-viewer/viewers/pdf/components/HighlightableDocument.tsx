
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PdfToolbar } from './PdfControlsToolbar';
import { PdfDocumentContainer } from './PdfDocumentContainer';
import { HighlightOverlay } from './HighlightOverlay';
import { useHighlightManager } from '../hooks/useHighlightManager';

interface HighlightableDocumentProps {
  file: { data?: File; url?: string };
  selectedColor: string;
  isHighlighter: boolean;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
}

export const HighlightableDocument: React.FC<HighlightableDocumentProps> = ({
  file,
  selectedColor,
  isHighlighter,
  onLoadSuccess,
  onLoadError
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const { toast } = useToast();

  const { 
    highlights, 
    isHighlightMode, 
    documentRef, 
    toggleHighlightMode 
  } = useHighlightManager(isHighlighter, selectedColor, pageNumber);
  
  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    onLoadSuccess({ numPages });
  };
  
  const changePage = (offset: number) => {
    const newPage = pageNumber + offset;
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
    }
  };
  
  const handleZoom = (factor: number) => {
    const newScale = scale + factor;
    if (newScale >= 0.5 && newScale <= 3) {
      setScale(newScale);
    }
  };
  
  const rotateDocument = () => {
    setRotation((rotation + 90) % 360);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          changePage(-1);
          break;
        case 'ArrowRight':
          changePage(1);
          break;
        case '+':
        case '=':
          if (e.ctrlKey) {
            e.preventDefault();
            handleZoom(0.1);
          }
          break;
        case '-':
          if (e.ctrlKey) {
            e.preventDefault();
            handleZoom(-0.1);
          }
          break;
        case 'r':
        case 'R':
          if (!e.ctrlKey && !e.altKey && !e.metaKey) {
            rotateDocument();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pageNumber, numPages, scale]);
  
  return (
    <>
      <PdfToolbar
        pageNumber={pageNumber}
        numPages={numPages}
        scale={scale}
        isHighlightMode={isHighlightMode}
        isHighlighter={isHighlighter}
        selectedColor={selectedColor}
        changePage={changePage}
        zoom={handleZoom}
        rotateDocument={rotateDocument}
        toggleHighlightMode={toggleHighlightMode}
      />
      
      <div ref={documentRef}>
        <PdfDocumentContainer
          file={file}
          pageNumber={pageNumber}
          scale={scale}
          rotation={rotation}
          onLoadSuccess={handleDocumentLoadSuccess}
          onLoadError={onLoadError}
        >
          <HighlightOverlay highlights={highlights} pageNumber={pageNumber} />
        </PdfDocumentContainer>
      </div>
    </>
  );
};
