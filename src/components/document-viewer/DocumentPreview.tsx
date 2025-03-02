
import React, { lazy, Suspense, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { getFileType } from './FileConverter';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from '@/components/ErrorBoundary';

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
  const { toast } = useToast();
  const [loadError, setLoadError] = useState<string | null>(null);

  const LoadingFallback = () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" aria-label="Loading document"></div>
    </div>
  );

  const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
    <div className="flex items-center justify-center h-full p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Document Viewer Error</AlertTitle>
        <AlertDescription>
          <p className="text-sm mb-4">
            {error.message || "Failed to render document"}
          </p>
          <button 
            onClick={resetErrorBoundary}
            className="text-xs underline hover:text-muted-foreground"
          >
            Try again
          </button>
        </AlertDescription>
      </Alert>
    </div>
  );

  const handleError = (error: Error) => {
    console.error("Document preview error:", error);
    setLoadError(error.message || "Failed to load document");
    toast({
      title: "Document Error",
      description: "There was a problem displaying this document",
      variant: "destructive",
    });
  };

  if (loadError) {
    return (
      <div 
        className="flex items-center justify-center h-full p-4"
        role="alert"
        aria-live="assertive"
      >
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Document Error</AlertTitle>
          <AlertDescription>
            <p className="text-sm mb-4">{loadError}</p>
            <button 
              onClick={() => setLoadError(null)}
              className="text-xs underline hover:text-muted-foreground"
            >
              Try again
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!file && !url) {
    return (
      <div 
        className="flex flex-col items-center justify-center h-full text-muted-foreground p-6 space-y-4"
        role="status"
        aria-label="No document loaded"
      >
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">No Document Loaded</h3>
          <p className="text-sm">Upload a file or paste a URL to view</p>
        </div>
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
          return (
            <div 
              className="flex items-center justify-center h-full p-4"
              role="alert"
              aria-live="polite"
            >
              <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Unsupported File Type</AlertTitle>
                <AlertDescription>
                  The file type you're trying to view is not supported.
                  Please try a PDF, TXT, or HTML file.
                </AlertDescription>
              </Alert>
            </div>
          );
      }
    } catch (error) {
      handleError(error as Error);
      return (
        <div 
          className="flex items-center justify-center h-full p-4"
          role="alert"
          aria-live="polite"
        >
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading File</AlertTitle>
            <AlertDescription>
              There was a problem loading this file. Please try again or use a different file.
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  }

  if (url) {
    // Handle PDF URLs
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
        <div className="h-full relative">
          <iframe
            src={url}
            className="w-full h-full border-0"
            title="Document preview"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setLoadError("Failed to load URL content")}
          />
        </div>
      </ErrorBoundary>
    );
  }

  return null;
};
