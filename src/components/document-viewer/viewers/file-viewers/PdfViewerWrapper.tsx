import React, { useState, useEffect } from 'react';
import PspdfkitViewer from '../pdf/PspdfkitViewer';
import CustomPDFViewer from '../pdf/components/CustomPDFViewer';
import usePspdfKit from '@/components/document-viewer/hooks/usePspdfKit';

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

  useEffect(() => {
    if (isFallbackRequired) {
      setUseFallback(true);
    }
  }, [isFallbackRequired]);

  if (useFallback || isFallbackRequired) {
    return (
      <CustomPDFViewer
        file={file}
        url={url}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
        highlightEnabled={highlightEnabled}
        setHighlightEnabled={setHighlightEnabled}
        setSelectedColor={setSelectedColor}
      />
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
