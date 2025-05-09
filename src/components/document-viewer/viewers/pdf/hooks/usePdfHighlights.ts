
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Highlight {
  id: string;
  content: {
    text: string;
  };
  position: {
    boundingRect: DOMRect;
    rects: DOMRect[];
    pageNumber: number;
  };
  comment?: string;
  color: string;
}

interface Position {
  boundingRect: DOMRect;
  rects: DOMRect[];
  pageNumber: number;
}

interface Content {
  text: string;
}

export const usePdfHighlights = (defaultColor: string) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>(null);

  const addHighlight = useCallback((highlight: Highlight) => {
    setHighlights(prevHighlights => [...prevHighlights, highlight]);
  }, []);

  const removeHighlight = useCallback((id: string) => {
    setHighlights(prevHighlights => prevHighlights.filter(h => h.id !== id));
    if (selectedHighlight === id) {
      setSelectedHighlight(null);
    }
  }, [selectedHighlight]);

  const updateHighlightColor = useCallback((id: string, color: string) => {
    setHighlights(prevHighlights => 
      prevHighlights.map(h => h.id === id ? { ...h, color } : h)
    );
  }, []);

  const handleSelectionFinished = useCallback(
    (
      position: Position,
      content: Content,
      hideTipFn: () => void,
      transformSelection: () => void
    ) => {
      // Create a new highlight
      const highlight: Highlight = {
        id: uuidv4(),
        content,
        position,
        color: defaultColor
      };
      
      addHighlight(highlight);
      hideTipFn();
      transformSelection();
    },
    [addHighlight, defaultColor]
  );

  return {
    highlights,
    selectedHighlight,
    setSelectedHighlight,
    addHighlight,
    removeHighlight,
    updateHighlightColor,
    handleSelectionFinished
  };
};
