
import { useState, useCallback } from 'react';
import { IHighlight, ScaledPosition } from 'react-pdf-highlighter';
import { useToast } from '@/hooks/use-toast';
import { convertPosition } from '../utils/highlightUtils';

// Extend the IHighlight interface to include color property
export interface PdfHighlight extends IHighlight {
  color?: string;
}

export const usePdfHighlights = (initialColor: string = '#ffeb3b') => {
  const [highlights, setHighlights] = useState<PdfHighlight[]>([]);
  const [selectedHighlight, setSelectedHighlight] = useState<PdfHighlight | null>(null);
  const { toast } = useToast();

  // Add highlight
  const addHighlight = useCallback((highlight: PdfHighlight) => {
    const newHighlight = {
      ...highlight,
      color: initialColor
    };
    
    setHighlights(prev => [...prev, newHighlight]);
    toast({
      title: "Highlight Added",
      description: "Text highlight has been added to the document",
    });
    
    return newHighlight;
  }, [initialColor, toast]);
  
  // Handle selection finish (when user highlights text)
  const handleSelectionFinished = useCallback(
    (position: ScaledPosition, content: { text?: string; image?: string }, hideTip: () => void, transformSelection: () => void) => {
      const highlight = {
        id: `highlight-${Date.now()}`,
        position: convertPosition(position),
        content,
        comment: {
          text: content.text || "",
          emoji: "💬"
        },
        color: initialColor
      };
      
      addHighlight(highlight as PdfHighlight);
      
      hideTip();
      if (transformSelection) transformSelection();
      
      return null;
    },
    [addHighlight, initialColor]
  );
  
  // Remove a highlight
  const removeHighlight = useCallback((id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
    setSelectedHighlight(null);
    
    toast({
      title: "Highlight Removed",
      description: "The highlight has been removed from the document",
    });
  }, [toast]);
  
  // Update a highlight's color
  const updateHighlightColor = useCallback((id: string, color: string) => {
    setHighlights(prev => 
      prev.map(h => h.id === id ? { ...h, color } : h)
    );
    
    toast({
      title: "Color Updated",
      description: "Highlight color has been changed",
    });
  }, [toast]);

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
