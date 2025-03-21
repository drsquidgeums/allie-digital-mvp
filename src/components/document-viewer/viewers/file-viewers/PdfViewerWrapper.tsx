
import React from 'react';
import SimplePdfViewer from '../../viewers/pdf/SimplePdfViewer';
import '@/styles/pdf/pdf-base.css';
import '@/styles/pdf/pdf-highlights.css';
import '@/styles/pdf/pdf-toolbar.css';
import '@/styles/pdf/pdf-accessibility.css';

interface PdfViewerWrapperProps {
  file: File | null;
  url: string;
}

export const PdfViewerWrapper: React.FC<PdfViewerWrapperProps> = ({ file, url }) => {
  // Default highlight color
  const selectedColor = '#ffeb3b';
  
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
        isHighlighter={true}
      />
    </div>
  );
};

export default PdfViewerWrapper;
