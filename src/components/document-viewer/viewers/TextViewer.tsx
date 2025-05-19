
import React, { useEffect, useState } from 'react';
import { readTextFile } from '../FileConverter';

interface TextViewerProps {
  file: File;
}

export const TextViewer = ({ file }: TextViewerProps) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const text = await readTextFile(file);
        
        // Process text to preserve structure
        const processedText = processTextContent(text);
        setContent(processedText);
      } catch (error) {
        console.error('Error reading file:', error);
        setContent('<p>Error loading file content</p>');
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [file]);

  // Function to process and structure text content
  const processTextContent = (text: string): string => {
    if (!text) return '<p>No content available</p>';
    
    // Replace new lines with proper paragraph breaks
    let processedText = text
      .replace(/\r\n|\r|\n/g, '</p><p>')
      .replace(/<p>\s*<\/p>/g, '<p>&nbsp;</p>');
    
    // Ensure text starts and ends with paragraph tags
    if (!processedText.startsWith('<p>')) {
      processedText = `<p>${processedText}`;
    }
    if (!processedText.endsWith('</p>')) {
      processedText = `${processedText}</p>`;
    }
    
    return processedText;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div
      className="p-4 focus:outline-none focus:ring-2 focus:ring-primary overflow-auto"
      dangerouslySetInnerHTML={{ __html: content }}
      style={{ minHeight: '100%' }}
      tabIndex={0}
      role="textbox"
      aria-label="Document content"
    />
  );
};
