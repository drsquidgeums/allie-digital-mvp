
import { useState, useEffect, useCallback } from 'react';

interface UsePdfViewerStateProps {
  file: File | null;
  url: string;
}

export interface HighlightArea {
  id: string;
  pageIndex: number;
  top: number;
  left: number;
  width: number;
  height: number;
  selectedColor?: string;
  isHighlighter?: boolean;
}

export const usePdfViewerState = ({ file, url }: UsePdfViewerStateProps) => {
  const [fileUrl, setFileUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<HighlightArea[]>([]);
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>(null);

  useEffect(() => {
    console.log("PdfViewer received file:", file?.name);
    console.log("PdfViewer received url:", url);
    
    setIsLoading(true);
    setError(null);
    
    if (file) {
      try {
        const objectUrl = URL.createObjectURL(file);
        console.log("Created object URL:", objectUrl);
        setFileUrl(objectUrl);
        setIsLoading(false);
        
        return () => {
          URL.revokeObjectURL(objectUrl);
        };
      } catch (err) {
        console.error("Error creating object URL:", err);
        setError(err instanceof Error ? err.message : "Failed to load PDF file");
        setIsLoading(false);
      }
    } else if (url) {
      setFileUrl(url);
      setIsLoading(false);
    } else {
      setFileUrl('');
      setIsLoading(false);
    }
  }, [file, url]);

  // Add a new highlight
  const addHighlight = useCallback((highlight: HighlightArea) => {
    setHighlights(prev => [...prev, highlight]);
  }, []);

  // Remove a highlight
  const removeHighlight = useCallback((highlightId: string) => {
    setHighlights(prev => prev.filter(h => h.id !== highlightId));
  }, []);

  // Update a highlight's properties
  const updateHighlight = useCallback((highlightId: string, updates: Partial<HighlightArea>) => {
    setHighlights(prev => 
      prev.map(h => h.id === highlightId ? { ...h, ...updates } : h)
    );
  }, []);

  return {
    fileUrl,
    isLoading,
    error,
    highlights,
    setHighlights,
    selectedHighlight,
    setSelectedHighlight,
    addHighlight,
    removeHighlight,
    updateHighlight
  };
};
