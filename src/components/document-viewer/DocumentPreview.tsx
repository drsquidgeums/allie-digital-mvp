
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
        className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center"
        role="status"
        aria-label="No document loaded"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-12 w-12 mb-4 text-muted-foreground/50" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
        <p className="text-base sm:text-lg">Upload a file or paste a URL to view</p>
        <p className="text-sm mt-2 text-muted-foreground/70">Supported formats: PDF, TXT, HTML and web URLs</p>
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
              className="flex flex-col items-center justify-center h-full text-destructive p-4 text-center"
              role="alert"
              aria-live="polite"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 mb-4 text-destructive/70" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
              <p className="text-lg">Unsupported file type</p>
              <p className="text-sm mt-2">Please upload a PDF, TXT, or HTML file</p>
            </div>
          );
      }
    } catch (error) {
      return (
        <div 
          className="flex flex-col items-center justify-center h-full text-destructive p-4 text-center"
          role="alert"
          aria-live="polite"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 mb-4 text-destructive/70" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <p className="text-lg">Error loading file</p>
          <p className="text-sm mt-2">Please try again with a different file</p>
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
