
import React, { useState } from 'react';
import { PSPDFKitViewer } from '../pdf/components/PSPDFKitViewer';
import { SimplePdfViewer } from '../pdf/SimplePdfViewer';
import '@/styles/pdf/pdf-base.css';
import '@/styles/pdf/pdf-highlights.css';
import '@/styles/pdf/pdf-toolbar.css';
import '@/styles/pdf/pdf-accessibility.css';
import '@/styles/pdf/pspdfkit.css';

interface PdfViewerWrapperProps {
  file: File | null;
  url: string;
  selectedColor?: string;
  isHighlighter?: boolean;
}

export const PdfViewerWrapper: React.FC<PdfViewerWrapperProps> = ({ 
  file, 
  url,
  selectedColor = '#ffeb3b',
  isHighlighter = true 
}) => {
  const [useFallback, setUseFallback] = useState<boolean>(false);

  // Function to handle PSPDFKit loading errors
  const handlePSPDFKitError = () => {
    setUseFallback(true);
  };

  return (
    <div className="h-full w-full flex flex-col relative">
      {/* Skip link for keyboard users */}
      <a href="#pdf-content" className="skip-link">
        Skip to PDF content
      </a>
      
      {!useFallback ? (
        <PSPDFKitViewer
          file={file}
          url={url}
          selectedColor={selectedColor}
          isHighlighter={isHighlighter}
        />
      ) : (
        <SimplePdfViewer
          file={file}
          url={url}
          selectedColor={selectedColor}
          isHighlighter={isHighlighter}
        />
      )}
    </div>
  );
};

export default PdfViewerWrapper;
