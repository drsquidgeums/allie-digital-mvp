
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from './viewers/EmptyState';
import { ErrorDisplay } from './viewers/ErrorDisplay';
import { FileTypeHandler } from './viewers/file-viewers/FileTypeHandler';
import { UrlHandler } from './viewers/file-viewers/UrlHandler';
import { RichTextEditorWrapper } from './viewers/file-viewers/RichTextEditorWrapper';

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
 * based on input type (file or URL) and handles error states.
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
  const [editMode, setEditMode] = useState<boolean>(!file && !url); // Start in edit mode if no file/URL

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

  // If no file/URL, show the rich text editor
  if (!file && !url) {
    return (
      <RichTextEditorWrapper
        selectedColor={selectedColor || '#FFFF00'}
        isHighlighter={isHighlighter}
        onContentLoaded={onContentLoaded}
      />
    );
  }

  // Handle file preview
  if (file) {
    console.log("DocumentPreview handling file:", file.name);
    console.log("DocumentPreview color settings:", selectedColor, isHighlighter);
    try {
      return (
        <FileTypeHandler
          file={file}
          selectedColor={selectedColor || '#FFFF00'} // Default yellow if no color specified
          isHighlighter={isHighlighter}
          onContentLoaded={onContentLoaded}
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

  // Handle URL preview
  if (url) {
    return (
      <UrlHandler
        url={url}
        selectedColor={selectedColor || '#FFFF00'} // Default yellow if no color specified
        isHighlighter={isHighlighter}
        onError={() => setLoadError("Failed to load URL content")}
      />
    );
  }

  return null;
};
