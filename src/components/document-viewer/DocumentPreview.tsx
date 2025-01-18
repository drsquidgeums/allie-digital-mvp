import React from 'react';
import { PdfViewer } from './viewers/PdfViewer';
import { TextViewer } from './viewers/TextViewer';
import { YouTubeViewer } from './viewers/YouTubeViewer';
import { getFileType } from './FileConverter';
import { getContentType } from '@/utils/contentUtils';

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
        Upload a file or paste a URL to view content (supports PDF, text, YouTube videos, and web pages)
      </div>
    );
  }

  if (file) {
    try {
      const fileType = getFileType(file);
      switch (fileType) {
        case 'pdf':
          return (
            <div className="h-full overflow-auto">
              <PdfViewer
                file={file}
                url=""
                selectedColor={selectedColor}
                isHighlighter={isHighlighter}
              />
            </div>
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
    const contentType = getContentType(url);
    
    switch (contentType) {
      case 'youtube':
        return <YouTubeViewer url={url} />;
      case 'pdf':
        return (
          <div className="h-full overflow-auto">
            <PdfViewer
              file={null}
              url={url}
              selectedColor={selectedColor}
              isHighlighter={isHighlighter}
            />
          </div>
        );
      case 'webpage':
        return (
          <iframe
            src={url}
            className="w-full h-full border-0"
            title="Document preview"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            referrerPolicy="no-referrer"
            tabIndex={0}
          />
        );
    }
  }

  return null;
};