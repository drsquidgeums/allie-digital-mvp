
import React from 'react';
import { getFileType } from '../../FileConverter';
import { PdfViewerWrapper } from './PdfViewerWrapper';
import { TextViewerWrapper } from './TextViewerWrapper';
import { ErrorDisplay } from '../ErrorDisplay';

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
        return <TextViewerWrapper file={file} />;
      default:
        // Handle unsupported file types
        return (
          <ErrorDisplay 
            title="Unsupported File Type" 
            description="The file type you're trying to view is not supported. Please try a PDF, TXT, or HTML file." 
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
