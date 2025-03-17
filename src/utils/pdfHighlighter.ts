
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

// Helper functions for position conversion
export const convertToScaledPosition = (position: any): any => {
  // Ensure the position has all required properties
  if (position.boundingRect) {
    // Convert from left/top to x1/y1 format
    if (!position.boundingRect.x1 && position.boundingRect.left !== undefined) {
      position.boundingRect.x1 = position.boundingRect.left;
      position.boundingRect.y1 = position.boundingRect.top;
      position.boundingRect.x2 = position.boundingRect.right;
      position.boundingRect.y2 = position.boundingRect.bottom;
    }
  }
  
  // Handle rects array similarly
  if (position.rects && Array.isArray(position.rects)) {
    position.rects = position.rects.map((rect: any) => {
      // Copy left, top, right, bottom to x1, y1, x2, y2 if needed
      if (!rect.x1 && rect.left !== undefined) {
        rect.x1 = rect.left;
        rect.y1 = rect.top;
        rect.x2 = rect.right;
        rect.y2 = rect.bottom;
      }
      return rect;
    });
  }
  
  return position;
};

export const convertToLTWHPosition = (position: any): any => {
  // Ensure the position has all required properties
  if (position.boundingRect) {
    // Convert from x1/y1 to left/top format
    if (!position.boundingRect.left && position.boundingRect.x1 !== undefined) {
      position.boundingRect.left = position.boundingRect.x1;
      position.boundingRect.top = position.boundingRect.y1;
      position.boundingRect.right = position.boundingRect.x2;
      position.boundingRect.bottom = position.boundingRect.y2;
      position.boundingRect.width = position.boundingRect.x2 - position.boundingRect.x1;
      position.boundingRect.height = position.boundingRect.y2 - position.boundingRect.y1;
    }
  }
  
  // Handle rects array similarly
  if (position.rects && Array.isArray(position.rects)) {
    position.rects = position.rects.map((rect: any) => {
      // Copy x1, y1, x2, y2 to left, top, right, bottom if needed
      if (!rect.left && rect.x1 !== undefined) {
        rect.left = rect.x1;
        rect.top = rect.y1;
        rect.right = rect.x2;
        rect.bottom = rect.y2;
        rect.width = rect.x2 - rect.x1;
        rect.height = rect.y2 - rect.y1;
      }
      return rect;
    });
  }
  
  return position;
};

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
    updateHighlightColor,
    convertToScaledPosition,
    convertToLTWHPosition
  };
};
