
import React from 'react';
import { PdfViewer } from './viewers/PdfViewer';
import { TextViewer } from './viewers/TextViewer';
import { getFileType } from './FileConverter';
import { getUrlType, isVideoUrl } from './urlUtils';

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
    // Handle PDF URLs
    if (url.toLowerCase().endsWith('.pdf')) {
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
    }

    // Handle video URLs (YouTube, Vimeo, etc.)
    if (isVideoUrl(url)) {
      return (
        <div className="h-full flex items-center justify-center bg-black">
          <iframe
            src={url}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video player"
          />
        </div>
      );
    }

    // Handle all other URLs with iframe
    return (
      <iframe
        src={url}
        className="w-full h-full border-0"
        title="Document preview"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        referrerPolicy="no-referrer"
        loading="lazy"
      />
    );
  }

  return null;
};
