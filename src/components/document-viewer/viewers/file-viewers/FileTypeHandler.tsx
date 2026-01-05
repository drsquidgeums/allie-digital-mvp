import React from 'react';
import { getFileType } from '../../FileConverter';
import { TextViewerWrapper } from './TextViewerWrapper';
import { RichTextEditorWrapper } from './RichTextEditorWrapper';
import { ErrorDisplay } from '../ErrorDisplay';

interface FileTypeHandlerProps {
  file: File;
  selectedColor: string;
  isHighlighter?: boolean;
  useRichTextEditor?: boolean;
  onContentLoaded?: (content: string, fileName: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}

/**
 * FileTypeHandler Component
 * 
 * Renders the appropriate viewer based on file type
 */
export const FileTypeHandler: React.FC<FileTypeHandlerProps> = ({
  file,
  selectedColor,
  isHighlighter,
  useRichTextEditor = true, // Default to using rich text editor for editable files
  onContentLoaded,
  onLoadingChange
}) => {
  try {
    console.log("FileTypeHandler received file:", file?.name);
    console.log("FileTypeHandler color settings:", selectedColor, isHighlighter);
    const fileType = getFileType(file);
    console.log("Detected file type:", fileType);
    
    // For editable text-based file types, use the rich text editor if enabled
    if (useRichTextEditor && (fileType === 'txt' || fileType === 'html' || fileType === 'docx')) {
      return (
        <RichTextEditorWrapper
          file={file}
          selectedColor={selectedColor || '#FFFF00'}
          isHighlighter={isHighlighter}
          onContentLoaded={onContentLoaded}
        />
      );
    }
    
    // Otherwise use the original viewers
    switch (fileType) {
      case 'txt':
      case 'html':
        return <TextViewerWrapper file={file} />;
      default:
        // Handle unsupported file types
        return (
          <ErrorDisplay 
            title="Unsupported File Type" 
            description="The file type you're trying to view is not supported. Please try a TXT, DOCX, or HTML file." 
          />
        );
    }
  } catch (error) {
    console.error("Error in FileTypeHandler:", error);
    return (
      <ErrorDisplay 
        title="Error Loading File" 
        description="There was a problem loading this file. Please try again or use a different file." 
      />
    );
  }
};
