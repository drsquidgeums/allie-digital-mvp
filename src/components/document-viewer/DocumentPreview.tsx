
import React from 'react';
import { EmptyState } from './viewers/EmptyState';
import { ErrorDisplay } from './viewers/ErrorDisplay';
import { PdfViewer } from './viewers/PdfViewer';
import { getFileType } from './FileConverter';

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
  
  // Handle PDF files specifically with PSPDFKit
  if (file && getFileType(file) === 'pdf') {
    return <PdfViewer file={file} url="" />;
  }
  
  // Handle PDF URLs
  if (url && url.toLowerCase().endsWith('.pdf')) {
    return <PdfViewer file={null} url={url} />;
  }

  // For non-PDF files, display basic file information
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-muted/10">
      {file && (
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">File loaded</h3>
          <p><strong>Name:</strong> {file.name}</p>
          <p><strong>Type:</strong> {file.type}</p>
          <p><strong>Size:</strong> {Math.round(file.size / 1024)} KB</p>
          {getFileType(file) !== 'pdf' && (
            <p className="mt-4 text-muted-foreground">This file type is not fully supported yet</p>
          )}
        </div>
      )}
      
      {!file && url && (
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">URL loaded</h3>
          <p><strong>URL:</strong> {url}</p>
          {!url.toLowerCase().endsWith('.pdf') && (
            <p className="mt-4 text-muted-foreground">Non-PDF URLs may not display correctly</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentPreview;
