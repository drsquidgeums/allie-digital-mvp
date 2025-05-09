
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IHighlight } from 'react-pdf-highlighter';

// Define a Comment type that's compatible with react-pdf-highlighter
export type Comment = {
  text: string;
  emoji: string;
};

// Custom type for PDF highlights that's compatible with IHighlight
export interface PdfHighlight {
  id: string;
  content: {
    text?: string;
    image?: string;
  };
  position: any;
  color?: string;
  comment: {
    text: string;
    emoji: string;
  };
}

interface Position {
  boundingRect: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
    [key: string]: any;
  };
  rects: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
    [key: string]: any;
  }[];
  pageNumber: number;
}

interface Content {
  text?: string;
  image?: string;
}

export const usePdfHighlights = (initialColor: string = '#FFFF00') => {
  const [highlights, setHighlights] = useState<PdfHighlight[]>([]);
  const [selectedHighlight, setSelectedHighlight] = useState<PdfHighlight | null>(null);
  const [activeColor, setActiveColor] = useState<string>(initialColor);
  
  // Add a highlight
  const addHighlight = useCallback((highlightData: Partial<PdfHighlight>): PdfHighlight => {
    const newHighlight: PdfHighlight = {
      id: uuidv4(),
      content: highlightData.content || { text: '' },
      position: highlightData.position,
      comment: highlightData.comment || { text: '', emoji: '💬' },
      color: activeColor
    };
    
    setHighlights(prev => [...prev, newHighlight]);
    return newHighlight;
  }, [activeColor]);
  
  // Remove a highlight
  const removeHighlight = useCallback((id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
  }, []);
  
  // Update highlight color
  const updateHighlightColor = useCallback((id: string, color: string) => {
    setHighlights(prev => prev.map(h => 
      h.id === id ? { ...h, color } : h
    ));
  }, []);
  
  // Handle text selection finished
  const handleSelectionFinished = useCallback(
    (
      position: Position,
      content: Content,
      hideTip: () => void,
      transformSelection: () => void
    ): null => {
      const newHighlight = addHighlight({
        position,
        content,
      });
      
      hideTip();
      transformSelection();
      
      return null;
    }, 
    [addHighlight]
  );
  
  // Convert highlights to IHighlight format for the react-pdf-highlighter
  const getHighlightsForReactPdfHighlighter = useCallback((): IHighlight[] => {
    return highlights.map(highlight => ({
      ...highlight,
      position: highlight.position,
      comment: highlight.comment
    })) as IHighlight[];
  }, [highlights]);
  
  return {
    highlights,
    selectedHighlight,
    setSelectedHighlight,
    addHighlight,
    removeHighlight,
    updateHighlightColor,
    handleSelectionFinished,
    getHighlightsForReactPdfHighlighter
  };
};
