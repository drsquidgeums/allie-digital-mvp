
import { useState, useCallback } from 'react';

export interface DocumentHighlight {
  id: string;
  pageNumber: number;
  content: string;
  position: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  color: string;
}

export const useDocumentHighlights = (defaultColor: string = '#ffeb3b') => {
  const [highlights, setHighlights] = useState<DocumentHighlight[]>([]);
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);

  // Add a new highlight
  const addHighlight = useCallback((highlight: DocumentHighlight) => {
    setHighlights(prev => [...prev, highlight]);
  }, []);

  // Remove a highlight
  const removeHighlight = useCallback((id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
  }, []);

  // Update a highlight's color
  const updateHighlightColor = useCallback((id: string, color: string) => {
    setHighlights(prev => 
      prev.map(h => h.id === id ? { ...h, color } : h)
    );
  }, []);

  // Get a highlight by its ID
  const getHighlightById = useCallback((id: string) => {
    return highlights.find(h => h.id === id) || null;
  }, [highlights]);

  return {
    highlights,
    selectedHighlightId,
    setSelectedHighlightId,
    addHighlight,
    removeHighlight,
    updateHighlightColor,
    getHighlightById
  };
};
