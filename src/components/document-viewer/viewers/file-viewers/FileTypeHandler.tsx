
import React from 'react';
import { getFileType } from '../../FileConverter';
import { PdfViewerWrapper } from './PdfViewerWrapper';
import { TextViewerWrapper } from './TextViewerWrapper';
import { DocxViewerWrapper } from './DocxViewerWrapper';
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
    console.log("FileTypeHandler received file:", file?.name, file?.type);
    console.log("FileTypeHandler color settings:", selectedColor, isHighlighter);
    
    // Check for empty file
    if (!file) {
      console.error("No file provided to FileTypeHandler");
      return (
        <ErrorDisplay 
          title="No File Selected" 
          description="Please select a file to view." 
        />
      );
    }
    
    // Special handling for docx files
    if (file.name.toLowerCase().endsWith('.docx') || 
        file.name.toLowerCase().endsWith('.doc') || 
        file.type.includes('wordprocessingml') || 
        file.type.includes('msword')) {
      console.log("Detected DOCX file by extension/type:", file.name, file.type);
      return <DocxViewerWrapper file={file} />;
    }
    
    // For other file types, use the general detection
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
      case 'docx':
        return <DocxViewerWrapper file={file} />;
      case 'txt':
      case 'html':
        return <TextViewerWrapper file={file} />;
      default:
        // Handle unsupported file types
        return (
          <ErrorDisplay 
            title="Unsupported File Type" 
            description="The file type you're trying to view is not supported. Please try a PDF, DOCX, TXT, or HTML file." 
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
