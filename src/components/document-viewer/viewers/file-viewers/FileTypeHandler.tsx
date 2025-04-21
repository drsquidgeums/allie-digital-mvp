
import React from 'react';
import { getFileType } from '../../FileConverter';
import { PdfViewerWrapper } from './PdfViewerWrapper';
import { TextViewerWrapper } from './TextViewerWrapper';
import { ErrorDisplay } from '../ErrorDisplay';
import { WordEditor } from '../word-editor/WordEditor';

interface FileTypeHandlerProps {
  file: File;
  selectedColor: string;
  isHighlighter?: boolean;
}

/**
 * FileTypeHandler Component
 * 
 * Renders the appropriate viewer based on file type
 */
export const FileTypeHandler: React.FC<FileTypeHandlerProps> = ({
  file,
  selectedColor,
  isHighlighter
}) => {
  try {
    console.log("FileTypeHandler received file:", file?.name);
    console.log("FileTypeHandler color settings:", selectedColor, isHighlighter);
    const fileType = getFileType(file);
    console.log("Detected file type:", fileType);
    
    // Check for word documents first
    if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
      return <WordEditor file={file} url="" />;
    }
    
    switch (fileType) {
      case 'pdf':
        return (
          <PdfViewerWrapper
            file={file}
            url=""
            selectedColor={selectedColor || '#FFFF00'} // Default to yellow if no color specified
            isHighlighter={isHighlighter}
          />
        );
      case 'txt':
      case 'html':
        return <WordEditor file={file} url="" />;
      default:
        // Try to open unknown types in the word editor
        return <WordEditor file={file} url="" />;
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
