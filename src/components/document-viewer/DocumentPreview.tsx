import React from 'react';
import { PdfViewer } from './viewers/PdfViewer';
import { TextViewer } from './viewers/TextViewer';
import { getFileType } from './FileConverter';

interface DocumentPreviewProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter
}) => {
  if (!file && !url) {
    return (
      <div 
        className="flex items-center justify-center h-full text-muted-foreground"
        role="status"
        aria-label="No document loaded"
      >
        Upload a file or paste a URL to view
      </div>
    );
  }

  if (file) {
    try {
      const fileType = getFileType(file);
      switch (fileType) {
        case 'pdf':
          return (
            <PdfViewer
              file={file}
              url=""
              selectedColor={selectedColor}
              isHighlighter={isHighlighter}
            />
          );
        case 'txt':
        case 'html':
          return <TextViewer file={file} />;
        default:
          return (
            <div 
              className="text-destructive"
              role="alert"
              aria-live="polite"
            >
              Unsupported file type
            </div>
          );
      }
    } catch (error) {
      return (
        <div 
          className="text-destructive"
          role="alert"
          aria-live="polite"
        >
          Error loading file
        </div>
      );
    }
  }

  if (url) {
    if (url.toLowerCase().endsWith('.pdf')) {
      return (
        <PdfViewer
          file={null}
          url={url}
          selectedColor={selectedColor}
          isHighlighter={isHighlighter}
        />
      );
    }
    return (
      <iframe
        src={url}
        className="w-full h-full border-0"
        title="Document preview"
        sandbox="allow-same-origin allow-scripts"
        tabIndex={0}
      />
    );
  }

  return null;
};