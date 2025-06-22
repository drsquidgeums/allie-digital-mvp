
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from './viewers/EmptyState';
import { ErrorDisplay } from './viewers/ErrorDisplay';
import { FileTypeHandler } from './viewers/file-viewers/FileTypeHandler';
import { UrlHandler } from './viewers/file-viewers/UrlHandler';
import { RichTextEditorWrapper } from './viewers/file-viewers/RichTextEditorWrapper';
import { LoadingFallback } from './viewers/LoadingFallback';

interface DocumentPreviewProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
  onContentLoaded?: (content: string, fileName: string) => void;
}

/**
 * DocumentPreview Component
 * 
 * Main container component that orchestrates the different document viewers
 * based on input type (file or URL) and handles error states with enhanced loading.
 */
export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter,
  onContentLoaded
}) => {
  const { toast } = useToast();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Handles errors from document loading and displays appropriate messages
   */
  const handleError = (error: Error) => {
    setIsLoading(false);
    setLoadError(error.message || "Failed to load document");
    toast({
      title: "Document Error",
      description: "There was a problem displaying this document",
      variant: "destructive",
    });
  };

  /**
   * Handles loading state changes
   */
  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
    if (loading) {
      setLoadError(null);
    }
  };

  // Display loading state
  if (isLoading) {
    const loadingType = file?.name?.endsWith('.pdf') ? 'pdf-page' : 'document';
    return (
      <LoadingFallback 
        type={loadingType}
        message={file ? `Loading ${file.name}...` : 'Loading document...'}
      />
    );
  }

  // Display error state if there was a problem loading the document
  if (loadError) {
    return (
      <div className="transition-opacity duration-300 ease-in-out">
        <ErrorDisplay 
          title="Document Error" 
          description={loadError}
          onRetry={() => {
            setLoadError(null);
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1000); // Simulate retry
          }} 
        />
      </div>
    );
  }

  // If no file/URL, show the rich text editor
  if (!file && !url) {
    return (
      <div className="transition-opacity duration-300 ease-in-out">
        <RichTextEditorWrapper
          selectedColor={selectedColor || '#FFFF00'}
          isHighlighter={isHighlighter}
          onContentLoaded={onContentLoaded}
        />
      </div>
    );
  }

  // Handle file preview
  if (file) {
    try {
      return (
        <div className="transition-opacity duration-300 ease-in-out">
          <FileTypeHandler
            file={file}
            selectedColor={selectedColor || '#FFFF00'}
            isHighlighter={isHighlighter}
            onContentLoaded={onContentLoaded}
            onLoadingChange={handleLoadingChange}
          />
        </div>
      );
    } catch (error) {
      handleError(error as Error);
      return (
        <div className="transition-opacity duration-300 ease-in-out">
          <ErrorDisplay 
            title="Error Loading File" 
            description="There was a problem loading this file. Please try again or use a different file." 
          />
        </div>
      );
    }
  }

  // Handle URL preview
  if (url) {
    return (
      <div className="transition-opacity duration-300 ease-in-out">
        <UrlHandler
          url={url}
          selectedColor={selectedColor || '#FFFF00'}
          isHighlighter={isHighlighter}
          onError={() => setLoadError("Failed to load URL content")}
          onLoadingChange={handleLoadingChange}
        />
      </div>
    );
  }

  return null;
};
