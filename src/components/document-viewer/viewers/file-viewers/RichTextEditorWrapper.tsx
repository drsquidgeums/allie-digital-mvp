
import React, { useState, useEffect } from 'react';
import RichTextEditor from '../text-editor/RichTextEditor';
import { extractTextFromFile } from '../../FileConverter';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

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
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Load content from file or URL
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      
      try {
        if (file) {
          // For HTML files, try to preserve formatting
          if (file.type === 'text/html' || file.name.toLowerCase().endsWith('.html')) {
            const text = await file.text();
            // Check if it's already HTML content
            if (text.trim().startsWith('<') && text.includes('</')) {
              setContent(text);
            } else {
              // Convert plain text to HTML paragraphs
              setContent(processTextContent(text, file.name));
            }
          } else {
            // Extract text from other file types and convert to HTML
            const extractedText = await extractTextFromFile(file);
            const processedContent = processTextContent(extractedText, file.name);
            setContent(processedContent);
          }
          
          // Set document title from display name or clean filename
          const cleanName = file.name.replace(/\.(html|doc|docx|txt)$/i, '');
          // If the filename has the timestamp_random_ format, extract the original name
          const parts = cleanName.split('_');
          const displayTitle = parts.length >= 3 ? parts.slice(2).join('_') : cleanName;
          setDocumentTitle(displayTitle);
          
          // Notify parent component that content is loaded
          if (onContentLoaded) {
            onContentLoaded(content, displayTitle);
          }
        } else if (url) {
          // Fetch content from URL
          const response = await fetch(url);
          const text = await response.text();
          
          // Check if it's HTML content
          if (text.trim().startsWith('<') && text.includes('</')) {
            setContent(text);
          } else {
            // Process as plain text
            const fileName = new URL(url).pathname.split('/').pop() || 'document';
            const processedContent = processTextContent(text, fileName);
            setContent(processedContent);
          }
          
          const fileName = new URL(url).pathname.split('/').pop() || 'document';
          const cleanName = fileName.replace(/\.(html|doc|docx|txt)$/i, '');
          const parts = cleanName.split('_');
          const displayTitle = parts.length >= 3 ? parts.slice(2).join('_') : cleanName;
          setDocumentTitle(displayTitle);
          
          // Notify parent component that content is loaded
          if (onContentLoaded) {
            onContentLoaded(content, displayTitle);
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
  const processTextContent = (text: string, fileName: string): string => {
    if (!text) return '<p>No content available</p>';
    
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
      onContentLoaded(newContent, documentTitle);
    }
  };

  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentTitle(e.target.value);
  };

  // Save title when pressing Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
      toast({
        title: "Document Title Updated",
        description: `Title changed to "${documentTitle}"`,
      });
      
      // Update session storage with new title
      sessionStorage.setItem('selectedFileName', documentTitle);
      
      // Notify parent component of title change
      if (onContentLoaded && !isLoading && content) {
        onContentLoaded(content, documentTitle);
      }
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
            {isEditingTitle ? (
              <Input 
                value={documentTitle}
                onChange={handleTitleChange}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={handleKeyDown}
                className="font-medium h-8 text-sm border-0 focus:border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                autoFocus
                aria-label="Document title"
              />
            ) : (
              <h2 
                className="text-sm font-medium truncate cursor-pointer hover:text-primary transition-colors" 
                title="Click to edit document title"
                onClick={() => setIsEditingTitle(true)}
              >
                {documentTitle}
              </h2>
            )}
          </div>
          <div className="flex-1">
            <RichTextEditor
              initialContent={content}
              onContentChange={handleContentChange}
              selectedColor={selectedColor}
              isReadOnly={false}
              documentTitle={documentTitle}
            />
          </div>
        </div>
      )}
    </div>
  );
};
