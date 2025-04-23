
import React from 'react';
import PspdfkitViewer from '../PspdfkitViewer';
import PdfiumViewer from './PdfiumViewer'; 
import FallbackPDFViewer from './FallbackPDFViewer';
import { usePdfViewerAvailability, PdfViewerType } from '../hooks/usePdfViewerAvailability';
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
  const { viewerType, isChecking } = usePdfViewerAvailability();
  
  // Show loading state while checking viewer availability
  if (isChecking) {
    return <LoadingFallback message="Initializing PDF viewer..." />;
  }

  // Select the appropriate viewer based on availability
  switch (viewerType) {
    case PdfViewerType.PSPDFKIT:
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
    
    case PdfViewerType.PDFIUM:
      return (
        <PdfiumViewer
          file={file}
          url={url}
          selectedColor={selectedColor}
          isHighlighter={isHighlighter}
          highlightEnabled={highlightEnabled}
          setHighlightEnabled={setHighlightEnabled}
          setSelectedColor={setSelectedColor}
        />
      );
    
    case PdfViewerType.REACT_PDF:
    default:
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
};

export default CustomPDFViewer;
