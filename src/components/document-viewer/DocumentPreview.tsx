
import React from 'react';
import { EmptyState } from './viewers/EmptyState';
import { ErrorDisplay } from './viewers/ErrorDisplay';
import { PdfViewer } from './viewers/PdfViewer';
import { getFileType } from './FileConverter';
import { FileTypeHandler } from './viewers/file-viewers/FileTypeHandler';
import { UrlHandler } from './viewers/file-viewers/UrlHandler';

interface DocumentPreviewProps {
  file: File | null;
  url: string;
}

/**
 * DocumentPreview Component
 * 
 * Main container component that handles different document types
 */
export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  file,
  url
}) => {
  // Display empty state when no document is loaded
  if (!file && !url) {
    return <EmptyState />;
  }
  
  // Handle file-based content
  if (file) {
    console.log("DocumentPreview: rendering file", file.name);
    // Use the FileTypeHandler for files
    return <FileTypeHandler file={file} selectedColor="#FFFF00" isHighlighter={true} />;
  }
  
  // Handle URL-based content
  if (url) {
    console.log("DocumentPreview: rendering URL", url);
    // Use the UrlHandler for URLs
    return <UrlHandler url={url} selectedColor="#FFFF00" isHighlighter={true} onError={() => console.error("URL loading error")} />;
  }

  // Fallback if we somehow reach this point
  return <EmptyState />;
};

export default DocumentPreview;
