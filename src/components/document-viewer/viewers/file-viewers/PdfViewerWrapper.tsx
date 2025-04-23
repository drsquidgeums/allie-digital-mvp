
import React from 'react';
import PspdfkitViewer from '../pdf/PspdfkitViewer';
import { CustomPDFViewer } from '../pdf/components/CustomPDFViewer';

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
  // First try to use our custom PDF viewer that will select the best available PDF library
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
};
