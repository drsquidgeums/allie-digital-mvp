
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export const usePdfDocumentState = () => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.0);
  const { toast } = useToast();
  const announcerRef = useRef<HTMLDivElement | null>(null);

  // Create a function to announce messages for screen readers
  const announce = useCallback((message: string) => {
    if (announcerRef.current) {
      announcerRef.current.textContent = message;
    }
  }, []);

  // Handle document load success
  const handleDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    
    toast({
      title: "PDF Loaded Successfully",
      description: `Document loaded with ${numPages} pages`,
    });
    
    announce(`PDF document loaded successfully with ${numPages} pages. You are on page 1.`);
  }, [toast, announce]);

  // Page navigation
  const changePage = useCallback((offset: number) => {
    setPageNumber(prevPage => {
      const newPage = prevPage + offset;
      if (newPage >= 1 && newPage <= numPages) {
        announce(`Page ${newPage} of ${numPages}`);
        return newPage;
      }
      return prevPage;
    });
  }, [numPages, announce]);

  // Go to specific page
  const goToPage = useCallback((pageNum: number) => {
    if (pageNum >= 1 && pageNum <= numPages) {
      setPageNumber(pageNum);
      announce(`Page ${pageNum} of ${numPages}`);
    }
  }, [numPages, announce]);

  // Zoom controls
  const changeZoom = useCallback((delta: number) => {
    setZoom(prevZoom => {
      const newZoom = prevZoom + delta;
      if (newZoom >= 0.5 && newZoom <= 3) {
        announce(`Zoom level set to ${Math.round(newZoom * 100)}%`);
        return newZoom;
      }
      return prevZoom;
    });
  }, [announce]);

  return {
    numPages,
    pageNumber,
    zoom,
    handleDocumentLoadSuccess,
    changePage,
    goToPage,
    changeZoom,
    announcerRef
  };
};
