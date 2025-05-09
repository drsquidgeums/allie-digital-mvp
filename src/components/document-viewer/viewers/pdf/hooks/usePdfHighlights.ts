
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IHighlight } from 'react-pdf-highlighter';

// Custom type for PDF highlights
export interface PdfHighlight extends IHighlight {
  id: string;
  color?: string;
  content: {
    text?: string;
    image?: string;
  };
  position: any;
  comment?: {
    text: string;
    emoji?: string;
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
  const addHighlight = useCallback((highlightData: Partial<PdfHighlight>) => {
    const newHighlight: PdfHighlight = {
      id: uuidv4(),
      content: highlightData.content || { text: '' },
      position: highlightData.position,
      comment: highlightData.comment || { text: '' },
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
  const handleSelectionFinished = useCallback((
    position: Position,
    content: Content,
    hideTip: () => void,
    transformSelection: () => void
  ) => {
    const newHighlight = addHighlight({
      position,
      content,
    });
    
    hideTip();
    transformSelection();
    
    return newHighlight;
  }, [addHighlight]);
  
  // Convert position format for compatibility
  const convertPosition = useCallback((position: any): any => {
    // Deep clone to avoid modifying the original
    const newPosition = JSON.parse(JSON.stringify(position));
    
    // Add necessary properties to boundingRect
    if (newPosition.boundingRect) {
      newPosition.boundingRect = {
        ...newPosition.boundingRect,
        left: newPosition.boundingRect.left || newPosition.boundingRect.x1,
        top: newPosition.boundingRect.top || newPosition.boundingRect.y1,
        right: newPosition.boundingRect.right || newPosition.boundingRect.x2,
        bottom: newPosition.boundingRect.bottom || newPosition.boundingRect.y2,
      };
    }
    
    // Process each rect similarly
    if (newPosition.rects && Array.isArray(newPosition.rects)) {
      newPosition.rects = newPosition.rects.map((rect: any) => ({
        ...rect,
        left: rect.left || rect.x1,
        top: rect.top || rect.y1,
        right: rect.right || rect.x2,
        bottom: rect.bottom || rect.y2,
      }));
    }
    
    return newPosition;
  }, []);
  
  return {
    highlights,
    selectedHighlight,
    setSelectedHighlight,
    addHighlight,
    removeHighlight,
    updateHighlightColor,
    handleSelectionFinished,
    convertPosition
  };
};
