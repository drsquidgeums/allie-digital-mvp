
import React, { useEffect, useState } from 'react';
import { readTextFile } from '../FileConverter';

interface TextViewerProps {
  file: File;
}

export const TextViewer = ({ file }: TextViewerProps) => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    const loadContent = async () => {
      try {
        const text = await readTextFile(file);
        setContent(text);
      } catch (error) {
        console.error('Error reading file:', error);
        setContent('Error loading file content');
      }
    };

    loadContent();
  }, [file]);

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
