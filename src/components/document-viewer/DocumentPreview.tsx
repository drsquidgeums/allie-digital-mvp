
import React from 'react';
import { EmptyState } from './viewers/EmptyState';
import { ErrorDisplay } from './viewers/ErrorDisplay';

interface DocumentPreviewProps {
  file: File | null;
  url: string;
}

/**
 * DocumentPreview Component
 * 
 * Main container component that handles different document types
 * Currently stripped of PDF functionality as we're starting fresh
 */
export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  file,
  url
}) => {
  // Display empty state when no document is loaded
  if (!file && !url) {
    return <EmptyState />;
  }

  // For now, just display basic file information
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-muted/10">
      {file && (
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">File loaded</h3>
          <p><strong>Name:</strong> {file.name}</p>
          <p><strong>Type:</strong> {file.type}</p>
          <p><strong>Size:</strong> {Math.round(file.size / 1024)} KB</p>
          <p className="mt-4 text-muted-foreground">PDF viewer has been removed and will be reimplemented</p>
        </div>
      )}
      
      {!file && url && (
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">URL loaded</h3>
          <p><strong>URL:</strong> {url}</p>
          <p className="mt-4 text-muted-foreground">PDF viewer has been removed and will be reimplemented</p>
        </div>
      )}
    </div>
  );
};

export default DocumentPreview;
