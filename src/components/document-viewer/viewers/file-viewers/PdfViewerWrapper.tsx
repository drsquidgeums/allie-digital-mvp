
import React from 'react';
import SimplePdfViewer from '../../viewers/pdf/SimplePdfViewer';
import '@/styles/pdf/pdf-base.css';
import '@/styles/pdf/pdf-highlights.css';
import '@/styles/pdf/pdf-toolbar.css';
import '@/styles/pdf/pdf-accessibility.css';

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
  return (
    <div className="h-full w-full flex flex-col relative">
      {/* Skip link for keyboard users */}
      <a href="#pdf-content" className="skip-link">
        Skip to PDF content
      </a>
      
      <SimplePdfViewer
        file={file}
        url={url}
        selectedColor={selectedColor}
        isHighlighter={isHighlighter}
      />
    </div>
  );
};

export default PdfViewerWrapper;
