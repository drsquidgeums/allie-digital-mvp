
import { useState, useCallback } from 'react';
import { HighlightItem } from '../components/HighlightsOverlay';

export const usePdfHighlights = (initialColor: string = '#FFFF00') => {
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);
  
  // Add a new highlight
  const addHighlight = useCallback((highlight: Omit<HighlightItem, 'color'>) => {
    const newHighlight = {
      ...highlight,
      color: initialColor
    } as HighlightItem;
    
    setHighlights(prev => [...prev, newHighlight]);
  }, [initialColor]);
  
  // Update an existing highlight
  const updateHighlight = useCallback((id: string, color: string) => {
    setHighlights(prev => 
      prev.map(h => h.id === id ? { ...h, color } : h)
    );
  }, []);
  
  // Delete a highlight
  const deleteHighlight = useCallback((id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
    setSelectedHighlightId(null);
  }, []);
  
  // Handle text selection for creating a highlight
  const handleTextSelection = useCallback((pageNumber: number) => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') return;
    
    // Create a simple highlight object from the selection
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const container = document.querySelector('.pdf-container');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    
    const highlight: Omit<HighlightItem, 'color'> = {
      id: `highlight-${Date.now()}`,
      content: { text: selection.toString() },
      position: {
        boundingRect: {
          x1: rect.left - containerRect.left,
          y1: rect.top - containerRect.top,
          x2: rect.right - containerRect.left,
          y2: rect.bottom - containerRect.top,
          width: rect.width,
          height: rect.height
        },
        pageNumber: pageNumber
      },
      comment: { text: '' }
    };
    
    addHighlight(highlight);
    selection.removeAllRanges();
  }, [addHighlight]);
  
  return {
    highlights,
    selectedHighlightId,
    setSelectedHighlightId,
    addHighlight,
    updateHighlight,
    deleteHighlight,
    handleTextSelection
  };
};
