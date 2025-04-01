
import React from 'react';
import { PSPDFKitViewer } from '../../PSPDFKitViewer';

interface CustomPDFViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const CustomPDFViewer: React.FC<CustomPDFViewerProps> = (props) => {
  return <PSPDFKitViewer {...props} />;
};

export default CustomPDFViewer;
