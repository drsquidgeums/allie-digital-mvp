
import { useState, useCallback } from 'react';
import { Highlight } from '../components/HighlightLayer';

export const useDocumentHighlights = (initialColor: string) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);

  // Add highlight
  const addHighlight = useCallback((highlight: Highlight) => {
    setHighlights(prev => [...prev, highlight]);
  }, []);

  // Remove highlight
  const removeHighlight = useCallback((id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
    setSelectedHighlightId(null);
  }, []);

  // Update highlight color
  const updateHighlightColor = useCallback((id: string, color: string) => {
    setHighlights(prev => 
      prev.map(h => h.id === id ? { ...h, color } : h)
    );
  }, []);

  // Get highlight by ID
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
