
import { useState, useCallback } from 'react';
import { IHighlight } from 'react-pdf-highlighter';

export interface HighlightPosition {
  boundingRect: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
  };
  rects: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
  }[];
  pageNumber: number;
}

export interface HighlightContent {
  text?: string;
  image?: string;
}

// Custom type that extends IHighlight and adds color property
export interface PdfHighlight extends Omit<IHighlight, 'comment'> {
  id: string;
  color?: string;
  comment: {
    text: string;
    emoji?: string;
  };
}

export const usePdfHighlighter = (initialColor: string = '#ffeb3b') => {
  const [highlights, setHighlights] = useState<PdfHighlight[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>(initialColor);
  
  // Add highlight
  const addHighlight = useCallback((highlight: Omit<PdfHighlight, 'color'>) => {
    const newHighlight = {
      ...highlight,
      color: selectedColor
    } as PdfHighlight;
    
    setHighlights(prev => [...prev, newHighlight]);
    return newHighlight;
  }, [selectedColor]);
  
  // Update highlight
  const updateHighlight = useCallback((id: string, updates: Partial<PdfHighlight>) => {
    setHighlights(prev => 
      prev.map(h => h.id === id ? { ...h, ...updates } : h)
    );
  }, []);
  
  // Remove highlight
  const removeHighlight = useCallback((id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
  }, []);
  
  // Change color for future highlights
  const changeColor = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);
  
  // Update color of existing highlight
  const updateHighlightColor = useCallback((id: string, color: string) => {
    updateHighlight(id, { color });
  }, [updateHighlight]);
  
  return {
    highlights,
    selectedColor,
    addHighlight,
    updateHighlight,
    removeHighlight,
    changeColor,
    updateHighlightColor
  };
};
