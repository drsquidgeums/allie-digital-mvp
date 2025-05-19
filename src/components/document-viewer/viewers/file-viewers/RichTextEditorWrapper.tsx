
import React, { useState, useEffect } from 'react';
import RichTextEditor from '../text-editor/RichTextEditor';
import { extractTextFromFile } from '../../FileConverter';

interface RichTextEditorWrapperProps {
  file?: File | null;
  url?: string;
  selectedColor: string;
  isHighlighter?: boolean;
  onContentLoaded?: (content: string, fileName: string) => void;
}

export const RichTextEditorWrapper: React.FC<RichTextEditorWrapperProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter,
  onContentLoaded
}) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Load content from file or URL
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      
      try {
        if (file) {
          // Extract text from the file
          const extractedText = await extractTextFromFile(file);
          setContent(extractedText);
          
          // Notify parent component that content is loaded
          if (onContentLoaded) {
            onContentLoaded(extractedText, file.name);
          }
        } else if (url) {
          // Fetch content from URL
          const response = await fetch(url);
          const text = await response.text();
          setContent(text);
          
          // Notify parent component that content is loaded
          if (onContentLoaded) {
            onContentLoaded(text, new URL(url).pathname.split('/').pop() || 'document');
          }
        }
      } catch (error) {
        console.error('Error loading content for editor:', error);
        setContent('');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContent();
  }, [file, url, onContentLoaded]);
  
  // Handle content change
  const handleContentChange = (newContent: string) => {
    if (onContentLoaded && !isLoading) {
      const fileName = file?.name || (url ? new URL(url).pathname.split('/').pop() : 'document');
      onContentLoaded(newContent, fileName || 'document');
    }
  };
  
  return (
    <div className="h-full w-full">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <RichTextEditor
          initialContent={content}
          onContentChange={handleContentChange}
          selectedColor={selectedColor}
          isReadOnly={false}
        />
      )}
    </div>
  );
};
