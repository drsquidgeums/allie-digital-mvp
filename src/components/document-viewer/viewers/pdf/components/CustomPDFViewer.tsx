
import React from 'react';
import PspdfkitViewer from '../PspdfkitViewer';
import FallbackPDFViewer from './FallbackPDFViewer';
import { usePspdfkitAvailability } from '../hooks/usePspdfkitAvailability';
import { LoadingFallback } from '../../LoadingFallback';

interface CustomPDFViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
  highlightEnabled?: boolean;
  setHighlightEnabled?: (enabled: boolean) => void;
  setSelectedColor?: (color: string) => void;
}

export const CustomPDFViewer: React.FC<CustomPDFViewerProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = true,
  highlightEnabled = false,
  setHighlightEnabled = () => {},
  setSelectedColor = () => {}
}) => {
  const { useFallback, isChecking } = usePspdfkitAvailability();
  
  // Show loading state while checking PSPDFKit availability
  if (isChecking) {
    return <LoadingFallback message="Initializing PDF viewer..." />;
  }

  // Based on availability, use PSPDFKit or fallback to react-pdf
  if (useFallback) {
    return (
      <FallbackPDFViewer 
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
  
  // Use PSPDFKit by default
  return (
    <PspdfkitViewer
      file={file}
      url={url}
      selectedColor={selectedColor}
      isHighlighter={isHighlighter}
      highlightEnabled={highlightEnabled}
      setHighlightEnabled={setHighlightEnabled}
      setSelectedColor={setSelectedColor}
    />
  );
};

export default CustomPDFViewer;
