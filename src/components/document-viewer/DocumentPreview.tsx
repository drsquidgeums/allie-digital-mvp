
import React, { lazy, Suspense, useState } from 'react';
import { getFileType } from './FileConverter';
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { EmptyState } from './viewers/EmptyState';
import { ErrorDisplay } from './viewers/ErrorDisplay';
import { LoadingFallback } from './viewers/LoadingFallback';
import { IframeViewer } from './viewers/IframeViewer';

// Lazy load the viewers for better performance
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

/**
 * DocumentPreview Component
 * 
 * Renders different document viewers based on the file type or URL.
 * Supports PDF, TXT, HTML files and URL content through iframes.
 * Handles lazy loading of viewer components and error states.
 * 
 * @param file - The file to be displayed, if any
 * @param url - The URL to be displayed, if any
 * @param selectedColor - The currently selected annotation color
 * @param isHighlighter - Boolean flag to determine if highlighter mode is active
 */
export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter
}) => {
  const { toast } = useToast();
  const [loadError, setLoadError] = useState<string | null>(null);

  /**
   * Handles errors from document loading and displays appropriate messages
   */
  const handleError = (error: Error) => {
    console.error("Document preview error:", error);
    setLoadError(error.message || "Failed to load document");
    toast({
      title: "Document Error",
      description: "There was a problem displaying this document",
      variant: "destructive",
    });
  };

  // Display error state if there was a problem loading the document
  if (loadError) {
    return (
      <ErrorDisplay 
        title="Document Error" 
        description={loadError}
        onRetry={() => setLoadError(null)} 
      />
    );
  }

  // Display empty state when no document is loaded
  if (!file && !url) {
    return <EmptyState />;
  }

  // Handle file preview based on file type
  if (file) {
    try {
      const fileType = getFileType(file);
      switch (fileType) {
        case 'pdf':
          return (
            <div className="h-full overflow-auto">
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                  <PdfViewer
                    file={file}
                    url=""
                    selectedColor={selectedColor}
                    isHighlighter={isHighlighter}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>
          );
        case 'txt':
        case 'html':
          return (
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
                <TextViewer file={file} />
              </Suspense>
            </ErrorBoundary>
          );
        default:
          // Handle unsupported file types
          return (
            <ErrorDisplay 
              title="Unsupported File Type" 
              description="The file type you're trying to view is not supported. Please try a PDF, TXT, or HTML file." 
            />
          );
      }
    } catch (error) {
      handleError(error as Error);
      return (
        <ErrorDisplay 
          title="Error Loading File" 
          description="There was a problem loading this file. Please try again or use a different file." 
        />
      );
    }
  }

  // Handle URL preview
  if (url) {
    // Special handling for PDF URLs
    if (url.toLowerCase().endsWith('.pdf')) {
      return (
        <div className="h-full overflow-auto">
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <PdfViewer
                file={null}
                url={url}
                selectedColor={selectedColor}
                isHighlighter={isHighlighter}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      );
    }

    // Handle all other URLs with iframe
    return (
      <ErrorBoundary>
        <IframeViewer 
          url={url} 
          onError={() => setLoadError("Failed to load URL content")} 
        />
      </ErrorBoundary>
    );
  }

  return null;
};
