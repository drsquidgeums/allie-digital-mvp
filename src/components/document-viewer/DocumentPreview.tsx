
import React from 'react';
import { Editor } from './Editor';
import { EmptyState } from './viewers/EmptyState';

interface DocumentPreviewProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  file,
  url
}) => {
  // Display empty state when no document is loaded
  if (!file && !url) {
    return <EmptyState />;
  }

  console.log("Rendering Editor in DocumentPreview");
  
  // Show the editor component
  return (
    <div className="h-full flex flex-col">
      <Editor />
    </div>
  );
};
