
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from './viewers/EmptyState';
import { ErrorDisplay } from './viewers/ErrorDisplay';
import { FileTypeHandler } from './viewers/file-viewers/FileTypeHandler';
import { UrlHandler } from './viewers/file-viewers/UrlHandler';
import { DocumentEditor } from './DocumentEditor';

interface DocumentPreviewProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

/**
 * DocumentPreview Component
 * 
 * Main container component that orchestrates the different document viewers
 * based on input type (file or URL) and handles error states.
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

  // Use the Document Editor for URLs
  if (url) {
    return (
      <DocumentEditor
        url={url}
        selectedColor={selectedColor || '#FFFF00'}
        isHighlighter={isHighlighter}
        onContentLoaded={(content, fileName) => {
          console.log("Document content loaded:", fileName);
        }}
      />
    );
  }
  
  // Handle file preview with existing components
  if (file) {
    console.log("DocumentPreview handling file:", file.name);
    console.log("DocumentPreview color settings:", selectedColor, isHighlighter);
    try {
      return (
        <FileTypeHandler
          file={file}
          selectedColor={selectedColor || '#FFFF00'} // Default yellow if no color specified
          isHighlighter={isHighlighter}
        />
      );
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

  return null;
};
