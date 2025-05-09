
import React, { useEffect, useState } from 'react';
import { readTextFile } from '../../FileConverter';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TextViewerWrapperProps {
  file: File;
}

export const TextViewerWrapper: React.FC<TextViewerWrapperProps> = ({ file }) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTextContent = async () => {
      try {
        setIsLoading(true);
        const text = await readTextFile(file);
        setContent(text);
        setError(null);
      } catch (err) {
        console.error('Error loading text file:', err);
        setError('Failed to load text content');
      } finally {
        setIsLoading(false);
      }
    };

    loadTextContent();
  }, [file]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-destructive rounded-md text-destructive">
        <p className="font-medium mb-1">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full border rounded-md overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 font-mono text-sm whitespace-pre-wrap">
          {content}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TextViewerWrapper;
