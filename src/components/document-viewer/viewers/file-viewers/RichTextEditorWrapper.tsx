
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
  const [documentTitle, setDocumentTitle] = useState<string>('Untitled Document');
  
  // Load content from file or URL
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      
      try {
        if (file) {
          // Extract text from the file
          const extractedText = await extractTextFromFile(file);
          // Process content to preserve structure
          const processedContent = processDocumentContent(extractedText, file.name);
          setContent(processedContent);
          setDocumentTitle(file.name);
          
          // Notify parent component that content is loaded
          if (onContentLoaded) {
            onContentLoaded(processedContent, file.name);
          }
        } else if (url) {
          // Fetch content from URL
          const response = await fetch(url);
          const text = await response.text();
          const fileName = new URL(url).pathname.split('/').pop() || 'document';
          
          // Process content to preserve structure
          const processedContent = processDocumentContent(text, fileName);
          setContent(processedContent);
          setDocumentTitle(fileName);
          
          // Notify parent component that content is loaded
          if (onContentLoaded) {
            onContentLoaded(processedContent, fileName);
          }
        }
      } catch (error) {
        console.error('Error loading content for editor:', error);
        setContent('<p>Error loading document content</p>');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContent();
  }, [file, url, onContentLoaded]);
  
  // Process document content to better preserve structure
  const processDocumentContent = (text: string, fileName: string): string => {
    if (!text) return '<p>No content available</p>';
    
    // Determine file type
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    
    // For HTML content, return as-is if it seems to be valid HTML
    if (text.trim().startsWith('<') && text.includes('</')) {
      // Basic check if it looks like HTML
      if (text.includes('<p') || text.includes('<div') || text.includes('<html')) {
        return text;
      }
    }
    
    // For plain text, format properly with paragraphs
    let processedContent = text
      .replace(/\r\n|\r|\n/g, '</p><p>')
      .replace(/<p>\s*<\/p>/g, '<p>&nbsp;</p>');
    
    // Ensure content is wrapped in paragraph tags
    if (!processedContent.startsWith('<p>')) {
      processedContent = `<p>${processedContent}`;
    }
    if (!processedContent.endsWith('</p>')) {
      processedContent = `${processedContent}</p>`;
    }
    
    return processedContent;
  };
  
  // Handle content change
  const handleContentChange = (newContent: string) => {
    if (onContentLoaded && !isLoading) {
      const fileName = file?.name || (url ? new URL(url).pathname.split('/').pop() : documentTitle);
      onContentLoaded(newContent, fileName || documentTitle);
    }
  };
  
  return (
    <div className="h-full w-full">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="px-4 py-2 border-b">
            <h2 className="text-sm font-medium truncate" title={documentTitle}>
              {documentTitle}
            </h2>
          </div>
          <div className="flex-1">
            <RichTextEditor
              initialContent={content}
              onContentChange={handleContentChange}
              selectedColor={selectedColor}
              isReadOnly={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};
