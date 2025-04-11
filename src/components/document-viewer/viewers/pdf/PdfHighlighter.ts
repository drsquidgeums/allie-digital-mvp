
import { useState, useCallback } from 'react';
import rangy from 'rangy';
import 'rangy/lib/rangy-textrange';
import 'rangy/lib/rangy-highlighter';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-serializer';

export interface Highlight {
  id: string;
  content: string;
  position: string; // Serialized position
  color: string;
  page: number;
}

export const usePdfHighlighter = () => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [highlighter, setHighlighter] = useState<any>(null);

  const initializeHighlighter = useCallback(() => {
    if (!highlighter) {
      rangy.init();
      const newHighlighter = rangy.createHighlighter();
      
      newHighlighter.addClassApplier(
        rangy.createClassApplier('pdf-highlight', {
          ignoreWhiteSpace: true,
          tagNames: ['span']
        })
      );
      
      setHighlighter(newHighlighter);
    }
    
    return highlighter;
  }, [highlighter]);

  const handleHighlight = useCallback((color: string, pageNumber: number) => {
    const hltr = initializeHighlighter();
    if (!hltr) return;
    
    const selection = rangy.getSelection();
    
    if (selection.toString().trim() === '') {
      console.log('No text selected for highlighting');
      return;
    }
    
    try {
      // Create a highlight
      hltr.highlightSelection('pdf-highlight', {
        containerElementId: 'pdf-page-container',
      });
      
      // Get the serialized position
      const serializedSelection = hltr.serializeSelection(selection);
      
      // Add the new highlight to state
      const newHighlight: Highlight = {
        id: Date.now().toString(),
        content: selection.toString(),
        position: serializedSelection,
        color,
        page: pageNumber
      };
      
      setHighlights(prev => [...prev, newHighlight]);
      
      // Clear the selection
      selection.removeAllRanges();
      
      console.log('Created highlight:', newHighlight);
      return newHighlight;
    } catch (error) {
      console.error('Error creating highlight:', error);
      return null;
    }
  }, [initializeHighlighter]);

  const removeHighlight = useCallback((id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
  }, []);

  return {
    highlights,
    handleHighlight,
    removeHighlight,
    initializeHighlighter
  };
};
