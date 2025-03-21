
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const usePdfDocumentState = () => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.0);
  const { toast } = useToast();

  // Handle document load success
  const handleDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    
    toast({
      title: "PDF Loaded Successfully",
      description: `Document loaded with ${numPages} pages`,
    });
  }, [toast]);

  // Page navigation
  const changePage = useCallback((offset: number) => {
    setPageNumber(prevPage => {
      const newPage = prevPage + offset;
      return newPage >= 1 && newPage <= numPages ? newPage : prevPage;
    });
  }, [numPages]);

  // Zoom controls
  const changeZoom = useCallback((delta: number) => {
    setZoom(prevZoom => {
      const newZoom = prevZoom + delta;
      return newZoom >= 0.5 && newZoom <= 3 ? newZoom : prevZoom;
    });
  }, []);

  return {
    numPages,
    pageNumber,
    zoom,
    handleDocumentLoadSuccess,
    changePage,
    changeZoom
  };
};
