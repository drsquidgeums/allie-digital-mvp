
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
    
    // Handle different file types
    if (fileType === 'pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      return (
        <PdfViewerWrapper
          file={file}
          url=""
          selectedColor={selectedColor || '#FFFF00'} // Default to yellow if no color specified
          isHighlighter={isHighlighter}
        />
      );
    }
    
    // For Word documents and other text-based files, use the Word Editor
    if (fileType === 'document' || 
        fileType === 'txt' || 
        fileType === 'html' ||
        file.name.toLowerCase().endsWith('.doc') || 
        file.name.toLowerCase().endsWith('.docx')) {
      return <WordEditor file={file} url="" />;
    }
    
    // Default to the Word Editor for other file types
    console.log("Using default Word Editor for unrecognized file type:", fileType);
    return <WordEditor file={file} url="" />;
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
