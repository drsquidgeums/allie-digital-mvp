
import { useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface KeyboardNavigationProps {
  pageNumber: number;
  numPages: number;
  zoom: number;
  selectedHighlightId: string | null;
  highlights: Array<{ id: string; pageNumber: number }>;
  changePage: (offset: number) => void;
  changeZoom: (delta: number) => void;
  setSelectedHighlightId: (id: string | null) => void;
  removeHighlight?: (id: string) => void;
}

export const useKeyboardNavigation = ({
  pageNumber,
  numPages,
  zoom,
  selectedHighlightId,
  highlights,
  changePage,
  changeZoom,
  setSelectedHighlightId,
  removeHighlight
}: KeyboardNavigationProps) => {
  const { toast } = useToast();

  // Navigate to next/previous highlight
  const navigateHighlights = useCallback((direction: 'next' | 'prev') => {
    if (highlights.length === 0) return;

    // Get highlights for the current page
    const currentPageHighlights = highlights.filter(h => h.pageNumber === pageNumber);
    if (currentPageHighlights.length === 0) return;

    // If no highlight is selected, select the first/last one
    if (!selectedHighlightId) {
      const targetHighlight = direction === 'next' 
        ? currentPageHighlights[0] 
        : currentPageHighlights[currentPageHighlights.length - 1];
      setSelectedHighlightId(targetHighlight.id);
      return;
    }

    // Find the index of the currently selected highlight
    const currentIndex = currentPageHighlights.findIndex(h => h.id === selectedHighlightId);
    if (currentIndex === -1) {
      // If the selected highlight is not on the current page, select the first/last one
      const targetHighlight = direction === 'next' 
        ? currentPageHighlights[0] 
        : currentPageHighlights[currentPageHighlights.length - 1];
      setSelectedHighlightId(targetHighlight.id);
      return;
    }

    // Calculate the next/previous index
    const nextIndex = direction === 'next'
      ? (currentIndex + 1) % currentPageHighlights.length
      : (currentIndex - 1 + currentPageHighlights.length) % currentPageHighlights.length;

    // Select the next/previous highlight
    setSelectedHighlightId(currentPageHighlights[nextIndex].id);
  }, [pageNumber, selectedHighlightId, highlights, setSelectedHighlightId]);

  // Keyboard event handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts if user is typing in an input field
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (e.key) {
      // Page navigation
      case 'ArrowRight':
      case 'PageDown':
        if (pageNumber < numPages) {
          changePage(1);
          toast({ title: `Page ${pageNumber + 1} of ${numPages}` });
        }
        break;
      case 'ArrowLeft':
      case 'PageUp':
        if (pageNumber > 1) {
          changePage(-1);
          toast({ title: `Page ${pageNumber - 1} of ${numPages}` });
        }
        break;
      case 'Home':
        if (pageNumber !== 1) {
          changePage(-(pageNumber - 1));
          toast({ title: `Page 1 of ${numPages}` });
        }
        break;
      case 'End':
        if (pageNumber !== numPages) {
          changePage(numPages - pageNumber);
          toast({ title: `Page ${numPages} of ${numPages}` });
        }
        break;

      // Zoom controls
      case '+':
      case '=':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          changeZoom(0.1);
          toast({ title: `Zoom: ${Math.round((zoom + 0.1) * 100)}%` });
        }
        break;
      case '-':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          changeZoom(-0.1);
          toast({ title: `Zoom: ${Math.round((zoom - 0.1) * 100)}%` });
        }
        break;
      case '0':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const resetZoom = 1.0;
          if (zoom !== resetZoom) {
            changeZoom(resetZoom - zoom);
            toast({ title: `Zoom reset to 100%` });
          }
        }
        break;

      // Highlight navigation
      case 'Tab':
        e.preventDefault();
        navigateHighlights(e.shiftKey ? 'prev' : 'next');
        break;

      // Delete selected highlight
      case 'Delete':
      case 'Backspace':
        if (selectedHighlightId && removeHighlight) {
          removeHighlight(selectedHighlightId);
          toast({ title: "Highlight removed" });
        }
        break;

      default:
        break;
    }
  }, [pageNumber, numPages, zoom, selectedHighlightId, changePage, changeZoom, navigateHighlights, removeHighlight, toast]);

  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    navigateHighlights
  };
};
