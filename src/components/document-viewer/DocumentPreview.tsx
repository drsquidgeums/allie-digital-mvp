
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ErrorDisplay } from './viewers/ErrorDisplay';
import { FileTypeHandler } from './viewers/file-viewers/FileTypeHandler';
import { RichTextEditorWrapper } from './viewers/file-viewers/RichTextEditorWrapper';
import { LoadingFallback } from './viewers/LoadingFallback';

interface DocumentPreviewProps {
  file: File | null;
  selectedColor: string;
  isHighlighter?: boolean;
  onContentLoaded?: (content: string, fileName: string) => void;
}

/**
 * DocumentPreview Component
 * 
 * Main container component that orchestrates the different document viewers
 * based on input type (file) and handles error states with enhanced loading.
 */
export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  file,
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
    return (
      <LoadingFallback 
        type="document"
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

  // If no file, show the rich text editor
  if (!file) {
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
};
