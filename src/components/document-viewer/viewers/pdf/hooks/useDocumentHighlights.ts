
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
      announce(`Highlight added: "${highlight.content}"`);
      return newHighlights;
    });
    
    toast({
      title: "Highlight Added",
      description: `Text has been highlighted: "${highlight.content.substring(0, 20)}${highlight.content.length > 20 ? '...' : ''}"`,
    });
  }, [toast, announce]);

  // Remove highlight
  const removeHighlight = useCallback((id: string) => {
    setHighlights(prev => {
      const highlightToRemove = prev.find(h => h.id === id);
      const newHighlights = prev.filter(h => h.id !== id);
      
      if (highlightToRemove) {
        announce(`Highlight removed: "${highlightToRemove.content}"`);
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
    return highlights.filter(h => h.pageNumber === pageNumber);
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
      announce(`Selected highlight: "${newSelectedHighlight.content}"`);
      return;
    }
    
    // Find the index of the currently selected highlight
    const currentIndex = pageHighlights.findIndex(h => h.id === selectedHighlightId);
    
    if (currentIndex === -1) {
      // If the selected highlight is not on the current page, select the first or last one
      const newSelectedHighlight = direction === 'next' ? pageHighlights[0] : pageHighlights[pageHighlights.length - 1];
      setSelectedHighlightId(newSelectedHighlight.id);
      announce(`Selected highlight: "${newSelectedHighlight.content}"`);
      return;
    }
    
    // Calculate the next index
    const nextIndex = direction === 'next'
      ? (currentIndex + 1) % pageHighlights.length
      : (currentIndex - 1 + pageHighlights.length) % pageHighlights.length;
    
    // Select the next/previous highlight
    setSelectedHighlightId(pageHighlights[nextIndex].id);
    announce(`Selected highlight ${nextIndex + 1} of ${pageHighlights.length}: "${pageHighlights[nextIndex].content}"`);
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
