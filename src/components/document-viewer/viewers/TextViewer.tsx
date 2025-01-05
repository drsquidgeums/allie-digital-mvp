import React from 'react';

interface TextViewerProps {
  content: string;
}

export const TextViewer = ({ content }: TextViewerProps) => {
  return (
    <div
      className="p-4"
      dangerouslySetInnerHTML={{ __html: content }}
      style={{ minHeight: '100%' }}
    />
  );
};