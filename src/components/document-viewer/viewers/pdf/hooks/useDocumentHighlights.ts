
import { useState, useCallback, useRef } from 'react';
import { Highlight } from '../components/HighlightLayer';
import { useToast } from '@/hooks/use-toast';

export const useDocumentHighlights = (initialColor: string) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);
  const { toast } = useToast();
  const announcerRef = useRef<HTMLDivElement | null>(null);

  // Announce messages for screen readers
  const announce = useCallback((message: string) => {
    if (announcerRef.current) {
      announcerRef.current.textContent = message;
    }
  }, []);

  // Add highlight
  const addHighlight = useCallback((highlight: Highlight) => {
    setHighlights(prev => {
      const newHighlights = [...prev, highlight];
      const contentText = highlight.content.text || '';
      announce(`Highlight added: "${contentText}"`);
      return newHighlights;
    });
    
    const displayText = highlight.content.text || '';
    const truncatedText = displayText.length > 20 
      ? `${displayText.substring(0, 20)}...` 
      : displayText;
    
    toast({
      title: "Highlight Added",
      description: `Text has been highlighted: "${truncatedText}"`,
    });
  }, [toast, announce]);

  // Remove highlight
  const removeHighlight = useCallback((id: string) => {
    setHighlights(prev => {
      const highlightToRemove = prev.find(h => h.id === id);
      const newHighlights = prev.filter(h => h.id !== id);
      
      if (highlightToRemove) {
        const contentText = highlightToRemove.content.text || '';
        announce(`Highlight removed: "${contentText}"`);
      }
      
      return newHighlights;
    });
    
    setSelectedHighlightId(null);
    
    toast({
      title: "Highlight Removed",
      description: "The highlight has been removed from the document",
    });
  }, [toast, announce]);

  // Update highlight color
  const updateHighlightColor = useCallback((id: string, color: string) => {
    setHighlights(prev => {
      const newHighlights = prev.map(h => h.id === id ? { ...h, color } : h);
      const updatedHighlight = newHighlights.find(h => h.id === id);
      
      if (updatedHighlight) {
        announce(`Highlight color updated to ${color}`);
      }
      
      return newHighlights;
    });
    
    toast({
      title: "Highlight Updated",
      description: "The highlight color has been changed",
    });
  }, [toast, announce]);

  // Get highlight by ID
  const getHighlightById = useCallback((id: string) => {
    return highlights.find(h => h.id === id) || null;
  }, [highlights]);

  // Get highlights for a specific page
  const getHighlightsForPage = useCallback((pageNumber: number) => {
    return highlights.filter(h => h.position.pageNumber === pageNumber);
  }, [highlights]);

  // Select next/previous highlight on the current page
  const navigateHighlights = useCallback((pageNumber: number, direction: 'next' | 'prev') => {
    const pageHighlights = getHighlightsForPage(pageNumber);
    
    if (pageHighlights.length === 0) {
      announce("No highlights on this page");
      return;
    }
    
    if (!selectedHighlightId) {
      // If no highlight is selected, select the first or last one
      const newSelectedHighlight = direction === 'next' ? pageHighlights[0] : pageHighlights[pageHighlights.length - 1];
      setSelectedHighlightId(newSelectedHighlight.id);
      const contentText = newSelectedHighlight.content.text || '';
      announce(`Selected highlight: "${contentText}"`);
      return;
    }
    
    // Find the index of the currently selected highlight
    const currentIndex = pageHighlights.findIndex(h => h.id === selectedHighlightId);
    
    if (currentIndex === -1) {
      // If the selected highlight is not on the current page, select the first or last one
      const newSelectedHighlight = direction === 'next' ? pageHighlights[0] : pageHighlights[pageHighlights.length - 1];
      setSelectedHighlightId(newSelectedHighlight.id);
      const contentText = newSelectedHighlight.content.text || '';
      announce(`Selected highlight: "${contentText}"`);
      return;
    }
    
    // Calculate the next index
    const nextIndex = direction === 'next'
      ? (currentIndex + 1) % pageHighlights.length
      : (currentIndex - 1 + pageHighlights.length) % pageHighlights.length;
    
    // Select the next/previous highlight
    setSelectedHighlightId(pageHighlights[nextIndex].id);
    const contentText = pageHighlights[nextIndex].content.text || '';
    announce(`Selected highlight ${nextIndex + 1} of ${pageHighlights.length}: "${contentText}"`);
  }, [selectedHighlightId, getHighlightsForPage, announce]);

  return {
    highlights,
    selectedHighlightId,
    setSelectedHighlightId,
    addHighlight,
    removeHighlight,
    updateHighlightColor,
    getHighlightById,
    getHighlightsForPage,
    navigateHighlights,
    announcerRef
  };
};
