import React from 'react';

interface TextViewerProps {
  content: string;
  onTextSelection: () => void;
}

export const TextViewer = ({ content, onTextSelection }: TextViewerProps) => {
  return (
    <div
      className="p-4"
      dangerouslySetInnerHTML={{ __html: content }}
      contentEditable
      style={{ minHeight: '100%' }}
      onMouseUp={onTextSelection}
    />
  );
};