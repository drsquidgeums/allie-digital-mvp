
import { useState } from 'react';
import { IHighlight, ScaledPosition } from 'react-pdf-highlighter';

export const useHighlightManager = () => {
  const [highlights, setHighlights] = useState<IHighlight[]>([]);
  const [selectedHighlight, setSelectedHighlight] = useState<IHighlight | null>(null);

  const addHighlight = (highlight: IHighlight) => {
    setHighlights([...highlights, highlight]);
  };

  const scrollToHighlight = (highlight: IHighlight) => {
    // Implementation kept the same
    const { pageNumber } = highlight.position;
    
    setTimeout(() => {
      const highlightElement = document.querySelector(
        `[data-highlight-id="${highlight.id}"]`
      );
      if (highlightElement) {
        highlightElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);

    return pageNumber;
  };

  const createNewHighlight = (
    position: ScaledPosition,
    content: { text?: string; image?: string },
  ): IHighlight => {
    return {
      id: `highlight_${Date.now()}`,
      content,
      position,
      comment: {
        text: "",
        emoji: "💬"
      }
    };
  };

  return {
    highlights,
    selectedHighlight,
    setSelectedHighlight,
    addHighlight,
    scrollToHighlight,
    createNewHighlight
  };
};
