
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Highlight {
  id: string;
  position: DOMRect;
  color: string;
  page: number;
}

export const useHighlightManager = (isHighlighter: boolean, selectedColor: string, pageNumber: number) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isHighlightMode, setIsHighlightMode] = useState<boolean>(false);
  const documentRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  // Toggle highlight mode
  const toggleHighlightMode = useCallback(() => {
    if (!isHighlighter) return;
    
    setIsHighlightMode(prev => !prev);
    toast({
      title: isHighlightMode ? "Highlight mode disabled" : "Highlight mode enabled",
      description: isHighlightMode ? 
        "Click to re-enable highlighting" : 
        "Select text to highlight with the current color",
    });
  }, [isHighlightMode, isHighlighter, toast]);

  // Create highlight from selection
  const createHighlight = useCallback(() => {
    if (!isHighlightMode || !isHighlighter) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.toString().trim() === '') return;
    
    try {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      if (rect.width === 0 || rect.height === 0) return;
      
      // Create new highlight
      const newHighlight = {
        id: `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        position: rect,
        color: selectedColor,
        page: pageNumber
      };
      
      setHighlights(prev => [...prev, newHighlight]);
      
      // Clear selection
      selection.removeAllRanges();
      
      toast({
        title: "Text highlighted",
        description: "Your selection has been highlighted",
      });
    } catch (error) {
      console.error("Error creating highlight:", error);
    }
  }, [isHighlightMode, isHighlighter, pageNumber, selectedColor, toast]);

  // Handle keyboard shortcuts for highlighting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'h' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        toggleHighlightMode();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleHighlightMode]);

  // Add event listener for text selection
  useEffect(() => {
    const handleMouseUp = () => {
      if (isHighlightMode) {
        createHighlight();
      }
    };
    
    const currentRef = documentRef.current;
    if (currentRef) {
      currentRef.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [isHighlightMode, createHighlight]);

  return {
    highlights,
    isHighlightMode,
    documentRef,
    toggleHighlightMode
  };
};
