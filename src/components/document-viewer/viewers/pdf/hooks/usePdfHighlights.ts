
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IHighlight } from 'react-pdf-highlighter';

// Define a Comment type that's compatible with react-pdf-highlighter
export interface PdfComment {
  text: string;
  emoji?: string;
}

// Custom type for PDF highlights
export interface PdfHighlight {
  id: string;
  content: {
    text?: string;
    image?: string;
  };
  position: any;
  color?: string;
  comment: PdfComment;
}

interface Position {
  boundingRect: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width?: number;
    height?: number;
    [key: string]: any;
  };
  rects: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width?: number;
    height?: number;
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
      id: highlightData.id || uuidv4(),
      content: highlightData.content || { text: '' },
      position: highlightData.position,
      comment: typeof highlightData.comment === 'string' 
        ? { text: highlightData.comment } 
        : highlightData.comment || { text: '', emoji: '💬' },
      color: activeColor
    };
    
    setHighlights(prev => [...prev, newHighlight]);
    return newHighlight;
  }, [activeColor]);
  
  // Remove a highlight
  const removeHighlight = useCallback((id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
    if (selectedHighlight?.id === id) {
      setSelectedHighlight(null);
    }
  }, [selectedHighlight]);
  
  // Update highlight color
  const updateHighlightColor = useCallback((id: string, color: string) => {
    setHighlights(prev => prev.map(h => 
      h.id === id ? { ...h, color } : h
    ));
  }, []);
  
  // Handle text selection finished - this function now returns PdfHighlight
  const handleSelectionFinished = useCallback(
    (
      position: Position,
      content: Content,
      hideTip: () => void,
      transformSelection: () => void
    ): PdfHighlight => {
      const newHighlight = addHighlight({
        position,
        content,
      });
      
      hideTip();
      transformSelection();
      
      return newHighlight;
    }, 
    [addHighlight]
  );
  
  return {
    highlights,
    selectedHighlight,
    setSelectedHighlight,
    addHighlight,
    removeHighlight,
    updateHighlightColor,
    handleSelectionFinished,
  };
};

