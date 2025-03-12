
import { useState, useEffect } from 'react';

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

  return {
    fileUrl,
    isLoading,
    error,
    highlights,
    setHighlights
  };
};

