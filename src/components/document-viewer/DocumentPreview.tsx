
import React from 'react';
import { EmptyState } from './viewers/EmptyState';
import { ErrorDisplay } from './viewers/ErrorDisplay';
import { PdfViewer } from './viewers/PdfViewer';
import { WordEditor } from './viewers/word-editor/WordEditor';
import { getFileType } from './FileConverter';
import { FileTypeHandler } from './viewers/file-viewers/FileTypeHandler';

interface DocumentPreviewProps {
  file: File | null;
  url: string;
  selectedColor?: string;
  isHighlighter?: boolean;
  onSave?: (content: string, fileName: string) => void;
}

/**
 * DocumentPreview Component
 * 
 * Main container component that handles different document types
 */
export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  file,
  url,
  selectedColor = '#FFFF00',
  isHighlighter = true,
  onSave
}) => {
  // Display empty state when no document is loaded
  if (!file && !url) {
    return <EmptyState />;
  }
  
  // Use the FileTypeHandler when we have a file
  if (file) {
    return <FileTypeHandler file={file} selectedColor={selectedColor} isHighlighter={isHighlighter} />;
  }
  
  // Handle PDF URLs
  if (url && url.toLowerCase().endsWith('.pdf')) {
    return <PdfViewer file={null} url={url} selectedColor={selectedColor} isHighlighter={isHighlighter} />;
  }
  
  // For non-PDF URLs, try to load them in the word editor
  if (url) {
    return <WordEditor file={null} url={url} onSave={onSave} />;
  }

  // Fallback error display if we somehow get here
  return (
    <ErrorDisplay 
      title="Unsupported Document" 
      description="This document type is not supported."
      variant="info" 
    />
  );
};

export default DocumentPreview;
