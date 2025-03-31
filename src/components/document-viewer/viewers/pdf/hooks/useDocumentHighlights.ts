
import { useState, useCallback, useRef } from 'react';
import { Highlight } from '../components/HighlightLayer';
import { useHighlightUtils } from '@/hooks/document-viewer/useHighlightUtils';
import { handleError } from '@/utils/errorHandling';

export const useDocumentHighlights = (initialColor: string) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);
  const announcerRef = useRef<HTMLDivElement | null>(null);
  
  // Use our shared highlight utilities
  const {
    announceHighlightAction,
    getHighlightText,
    notifyHighlightAction
  } = useHighlightUtils(initialColor);

  // Add highlight
  const addHighlight = useCallback((highlight: Highlight) => {
    try {
      setHighlights(prev => {
        const newHighlights = [...prev, highlight];
        const contentText = highlight.content.text || '';
        announceHighlightAction(`Highlight added: "${contentText}"`, announcerRef);
        return newHighlights;
      });
      
      notifyHighlightAction('add', highlight.content);
    } catch (error) {
      handleError(error, { 
        title: "Highlight Error",
        fallbackMessage: "Could not add highlight" 
      });
    }
  }, [announceHighlightAction, notifyHighlightAction]);

  // Remove highlight
  const removeHighlight = useCallback((id: string) => {
    try {
      setHighlights(prev => {
        const highlightToRemove = prev.find(h => h.id === id);
        const newHighlights = prev.filter(h => h.id !== id);
        
        if (highlightToRemove) {
          const contentText = highlightToRemove.content.text || '';
          announceHighlightAction(`Highlight removed: "${contentText}"`, announcerRef);
        }
        
        return newHighlights;
      });
      
      setSelectedHighlightId(null);
      notifyHighlightAction('remove');
    } catch (error) {
      handleError(error, { 
        title: "Highlight Error",
        fallbackMessage: "Could not remove highlight" 
      });
    }
  }, [announceHighlightAction, notifyHighlightAction]);

  // Update highlight color
  const updateHighlightColor = useCallback((id: string, color: string) => {
    try {
      setHighlights(prev => {
        const newHighlights = prev.map(h => h.id === id ? { ...h, color } : h);
        const updatedHighlight = newHighlights.find(h => h.id === id);
        
        if (updatedHighlight) {
          announceHighlightAction(`Highlight color updated to ${color}`, announcerRef);
        }
        
        return newHighlights;
      });
      
      notifyHighlightAction('update');
    } catch (error) {
      handleError(error, { 
        title: "Highlight Error",
        fallbackMessage: "Could not update highlight color" 
      });
    }
  }, [announceHighlightAction, notifyHighlightAction]);

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
    try {
      const pageHighlights = getHighlightsForPage(pageNumber);
      
      if (pageHighlights.length === 0) {
        announceHighlightAction("No highlights on this page", announcerRef);
        return;
      }
      
      if (!selectedHighlightId) {
        // If no highlight is selected, select the first or last one
        const newSelectedHighlight = direction === 'next' ? pageHighlights[0] : pageHighlights[pageHighlights.length - 1];
        setSelectedHighlightId(newSelectedHighlight.id);
        const contentText = newSelectedHighlight.content.text || '';
        announceHighlightAction(`Selected highlight: "${contentText}"`, announcerRef);
        return;
      }
      
      // Find the index of the currently selected highlight
      const currentIndex = pageHighlights.findIndex(h => h.id === selectedHighlightId);
      
      if (currentIndex === -1) {
        // If the selected highlight is not on the current page, select the first or last one
        const newSelectedHighlight = direction === 'next' ? pageHighlights[0] : pageHighlights[pageHighlights.length - 1];
        setSelectedHighlightId(newSelectedHighlight.id);
        const contentText = newSelectedHighlight.content.text || '';
        announceHighlightAction(`Selected highlight: "${contentText}"`, announcerRef);
        return;
      }
      
      // Calculate the next index
      const nextIndex = direction === 'next'
        ? (currentIndex + 1) % pageHighlights.length
        : (currentIndex - 1 + pageHighlights.length) % pageHighlights.length;
      
      // Select the next/previous highlight
      setSelectedHighlightId(pageHighlights[nextIndex].id);
      const contentText = pageHighlights[nextIndex].content.text || '';
      announceHighlightAction(`Selected highlight ${nextIndex + 1} of ${pageHighlights.length}: "${contentText}"`, announcerRef);
    } catch (error) {
      handleError(error, { 
        title: "Highlight Navigation Error",
        fallbackMessage: "Could not navigate between highlights",
        showToast: false
      });
    }
  }, [selectedHighlightId, getHighlightsForPage, announceHighlightAction]);

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
