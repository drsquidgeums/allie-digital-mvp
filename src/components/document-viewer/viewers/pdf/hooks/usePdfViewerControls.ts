
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const usePdfViewerControls = () => {
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(0);
  const { toast } = useToast();

  const zoomIn = useCallback(() => {
    setScale((prevScale) => Math.min(prevScale + 0.2, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
  }, []);

  const fitToScreen = useCallback(() => {
    setScale(1.0); // Reset to default scale
    toast({
      title: "Fit to Screen",
      description: "Document adjusted to fit screen",
    });
  }, [toast]);

  const rotateClockwise = useCallback(() => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
    toast({
      title: "Document Rotated",
      description: "Document rotated clockwise by 90°",
    });
  }, [toast]);

  const rotateCounterClockwise = useCallback(() => {
    setRotation((prevRotation) => (prevRotation - 90 + 360) % 360);
  }, []);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, numPages));
  }, [numPages]);

  const updateCurrentPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleDocumentLoaded = useCallback((numPages: number) => {
    console.log(`Document loaded with ${numPages} pages`);
    setNumPages(numPages);
  }, []);

  return {
    scale,
    rotation,
    currentPage,
    numPages,
    zoomIn,
    zoomOut,
    fitToScreen,
    rotateClockwise,
    rotateCounterClockwise,
    goToPreviousPage,
    goToNextPage,
    updateCurrentPage,
    handleDocumentLoaded
  };
};
