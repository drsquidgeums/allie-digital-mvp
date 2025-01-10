import React from 'react';

interface TextViewerProps {
  content: string;
}

export const TextViewer = ({ content }: TextViewerProps) => {
  return (
    <div
      className="p-4 focus:outline-none focus:ring-2 focus:ring-primary"
      dangerouslySetInnerHTML={{ __html: content }}
      style={{ minHeight: '100%' }}
      tabIndex={0}
      role="textbox"
      aria-label="Document content"
    />
  );
};