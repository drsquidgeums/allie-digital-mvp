
import React, { lazy, Suspense } from 'react';
import { getFileType } from './FileConverter';

// Lazy load the viewers
const PdfViewer = lazy(() => import('./viewers/PdfViewer').then(module => ({
  default: module.PdfViewer
})));
const TextViewer = lazy(() => import('./viewers/TextViewer').then(module => ({
  default: module.TextViewer
})));

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
  const LoadingFallback = () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

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
              <Suspense fallback={<LoadingFallback />}>
                <PdfViewer
                  file={file}
                  url=""
                  selectedColor={selectedColor}
                  isHighlighter={isHighlighter}
                />
              </Suspense>
            </div>
          );
        case 'txt':
        case 'html':
          return (
            <Suspense fallback={<LoadingFallback />}>
              <TextViewer file={file} />
            </Suspense>
          );
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
          <Suspense fallback={<LoadingFallback />}>
            <PdfViewer
              file={null}
              url={url}
              selectedColor={selectedColor}
              isHighlighter={isHighlighter}
            />
          </Suspense>
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
