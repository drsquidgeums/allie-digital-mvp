
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
    if (highlights.length === 0) {
      // Announce to screen readers
      const announcement = "No highlights available to navigate";
      const liveRegion = document.getElementById('pdf-announcements') || createLiveRegion();
      liveRegion.textContent = announcement;
      return;
    }

    // Get highlights for the current page
    const currentPageHighlights = highlights.filter(h => h.pageNumber === pageNumber);
    if (currentPageHighlights.length === 0) {
      const announcement = `No highlights on page ${pageNumber}`;
      const liveRegion = document.getElementById('pdf-announcements') || createLiveRegion();
      liveRegion.textContent = announcement;
      return;
    }

    // If no highlight is selected, select the first/last one
    if (!selectedHighlightId) {
      const targetHighlight = direction === 'next' 
        ? currentPageHighlights[0] 
        : currentPageHighlights[currentPageHighlights.length - 1];
      setSelectedHighlightId(targetHighlight.id);
      announceHighlightSelection(direction === 'next' ? 1 : currentPageHighlights.length, currentPageHighlights.length);
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
      announceHighlightSelection(direction === 'next' ? 1 : currentPageHighlights.length, currentPageHighlights.length);
      return;
    }

    // Calculate the next/previous index
    const nextIndex = direction === 'next'
      ? (currentIndex + 1) % currentPageHighlights.length
      : (currentIndex - 1 + currentPageHighlights.length) % currentPageHighlights.length;

    // Select the next/previous highlight
    setSelectedHighlightId(currentPageHighlights[nextIndex].id);
    announceHighlightSelection(nextIndex + 1, currentPageHighlights.length);
  }, [pageNumber, selectedHighlightId, highlights, setSelectedHighlightId]);

  // Helper function to create a live region for announcements
  const createLiveRegion = () => {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'pdf-announcements';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
    return liveRegion;
  };

  // Helper function to announce highlight selection
  const announceHighlightSelection = (current: number, total: number) => {
    const announcement = `Highlight ${current} of ${total} selected`;
    const liveRegion = document.getElementById('pdf-announcements') || createLiveRegion();
    liveRegion.textContent = announcement;
  };

  // Helper function to announce page navigation
  const announcePageNavigation = (page: number, total: number) => {
    const announcement = `Page ${page} of ${total}`;
    const liveRegion = document.getElementById('pdf-announcements') || createLiveRegion();
    liveRegion.textContent = announcement;
  };

  // Helper function to announce zoom changes
  const announceZoomChange = (zoomLevel: number) => {
    const announcement = `Zoom level: ${Math.round(zoomLevel * 100)}%`;
    const liveRegion = document.getElementById('pdf-announcements') || createLiveRegion();
    liveRegion.textContent = announcement;
  };

  // Keyboard event handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts if user is typing in an input field
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    // Check if user is in a dialog or modal
    const isInDialog = (e.target as Element)?.closest('[role="dialog"]') !== null;
    if (isInDialog) {
      return;
    }

    switch (e.key) {
      // Page navigation
      case 'ArrowRight':
      case 'PageDown':
        if (pageNumber < numPages) {
          e.preventDefault();
          changePage(1);
          announcePageNavigation(pageNumber + 1, numPages);
          toast({ title: `Page ${pageNumber + 1} of ${numPages}` });
        }
        break;
      case 'ArrowLeft':
      case 'PageUp':
        if (pageNumber > 1) {
          e.preventDefault();
          changePage(-1);
          announcePageNavigation(pageNumber - 1, numPages);
          toast({ title: `Page ${pageNumber - 1} of ${numPages}` });
        }
        break;
      case 'Home':
        if (pageNumber !== 1) {
          e.preventDefault();
          changePage(-(pageNumber - 1));
          announcePageNavigation(1, numPages);
          toast({ title: `Page 1 of ${numPages}` });
        }
        break;
      case 'End':
        if (pageNumber !== numPages) {
          e.preventDefault();
          changePage(numPages - pageNumber);
          announcePageNavigation(numPages, numPages);
          toast({ title: `Page ${numPages} of ${numPages}` });
        }
        break;

      // Zoom controls
      case '+':
      case '=':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const newZoom = zoom + 0.1;
          changeZoom(0.1);
          announceZoomChange(newZoom);
          toast({ title: `Zoom: ${Math.round(newZoom * 100)}%` });
        }
        break;
      case '-':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const newZoom = zoom - 0.1;
          changeZoom(-0.1);
          announceZoomChange(newZoom);
          toast({ title: `Zoom: ${Math.round(newZoom * 100)}%` });
        }
        break;
      case '0':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const resetZoom = 1.0;
          if (zoom !== resetZoom) {
            changeZoom(resetZoom - zoom);
            announceZoomChange(resetZoom);
            toast({ title: `Zoom reset to 100%` });
          }
        }
        break;

      // Highlight navigation
      case 'Tab':
        if (!e.ctrlKey && !e.altKey) {
          e.preventDefault();
          navigateHighlights(e.shiftKey ? 'prev' : 'next');
        }
        break;

      // Delete selected highlight
      case 'Delete':
      case 'Backspace':
        if (selectedHighlightId && removeHighlight) {
          e.preventDefault();
          removeHighlight(selectedHighlightId);
          const announcement = "Highlight removed";
          const liveRegion = document.getElementById('pdf-announcements') || createLiveRegion();
          liveRegion.textContent = announcement;
          toast({ title: "Highlight removed" });
        }
        break;

      // Help
      case 'F1':
      case '?':
        if (e.shiftKey || e.key === 'F1') {
          e.preventDefault();
          // You can trigger a help dialog here
          toast({ 
            title: "Keyboard Shortcuts", 
            description: "Arrow keys: Navigate pages, Tab: Navigate highlights, Ctrl+/-: Zoom, Delete: Remove highlight" 
          });
        }
        break;

      default:
        break;
    }
  }, [pageNumber, numPages, zoom, selectedHighlightId, changePage, changeZoom, navigateHighlights, removeHighlight, toast]);

  // Set up keyboard event listeners
  useEffect(() => {
    // Create live region for announcements if it doesn't exist
    if (!document.getElementById('pdf-announcements')) {
      createLiveRegion();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Cleanup live region on unmount
  useEffect(() => {
    return () => {
      const liveRegion = document.getElementById('pdf-announcements');
      if (liveRegion) {
        liveRegion.remove();
      }
    };
  }, []);

  return {
    navigateHighlights
  };
};
