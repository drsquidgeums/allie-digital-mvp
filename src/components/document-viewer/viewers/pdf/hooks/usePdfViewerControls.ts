
import { useState, useCallback } from 'react';

export const usePdfViewerControls = () => {
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(0);

  const zoomIn = useCallback(() => {
    setScale((prevScale) => Math.min(prevScale + 0.2, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
  }, []);

  const rotateClockwise = useCallback(() => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  }, []);

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
    rotateClockwise,
    rotateCounterClockwise,
    goToPreviousPage,
    goToNextPage,
    updateCurrentPage,
    handleDocumentLoaded
  };
};
