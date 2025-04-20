
import React, { useState, useEffect } from 'react';
import PspdfkitViewer from '../pdf/PspdfkitViewer';
import CustomPDFViewer from '../pdf/components/CustomPDFViewer';
import usePspdfKit from '@/components/document-viewer/hooks/usePspdfKit';
import { useToast } from '@/hooks/use-toast';
import { ErrorDisplay } from '../ErrorDisplay';

interface PdfViewerWrapperProps {
  file: File | null;
  url: string;
  selectedColor?: string;
  isHighlighter?: boolean;
  highlightEnabled?: boolean;
  setHighlightEnabled?: (enabled: boolean) => void;
  setSelectedColor?: (color: string) => void;
}

export const PdfViewerWrapper: React.FC<PdfViewerWrapperProps> = ({
  file,
  url,
  selectedColor = '#FFFF00',
  isHighlighter = true,
  highlightEnabled = false,
  setHighlightEnabled = () => {},
  setSelectedColor = () => {}
}) => {
  const { isReady, isFallbackRequired } = usePspdfKit();
  const [useFallback, setUseFallback] = useState(false);
  const [showFallbackNotice, setShowFallbackNotice] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isFallbackRequired) {
      setUseFallback(true);
      setShowFallbackNotice(true);
      
      // Hide the notice after 5 seconds
      const timer = setTimeout(() => {
        setShowFallbackNotice(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isFallbackRequired]);

  // Handle dismissal of the fallback notice
  const dismissFallbackNotice = () => {
    setShowFallbackNotice(false);
  };

  if (useFallback || isFallbackRequired) {
    return (
      <div className="flex flex-col h-full relative">
        {showFallbackNotice && (
          <div className="absolute top-0 left-0 right-0 z-10 px-4 py-2">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2 shadow-lg flex items-center justify-between">
              <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                <span className="font-medium">Using built-in PDF viewer</span>
              </div>
              <button 
                onClick={dismissFallbackNotice}
                className="ml-3 text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
                aria-label="Dismiss notice"
              >
                ×
              </button>
            </div>
          </div>
        )}
        <CustomPDFViewer
          file={file}
          url={url}
          selectedColor={selectedColor}
          isHighlighter={isHighlighter}
          highlightEnabled={highlightEnabled}
          setHighlightEnabled={setHighlightEnabled}
          setSelectedColor={setSelectedColor}
        />
      </div>
    );
  }

  return (
    <PspdfkitViewer 
      file={file} 
      url={url} 
      selectedColor={selectedColor} 
      isHighlighter={isHighlighter}
      highlightEnabled={highlightEnabled}
      setHighlightEnabled={setHighlightEnabled}
    />
  );
};
