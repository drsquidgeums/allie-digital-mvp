
import React from 'react';
import { Editor } from '@tiptap/react';
import { FileButtons } from '../FileButtons';

interface FileButtonsSectionProps {
  editor: Editor;
  onFileImport: (content: string) => void;
  documentTitle?: string;
}

export const FileButtonsSection: React.FC<FileButtonsSectionProps> = ({ 
  editor,
  onFileImport,
  documentTitle = 'Untitled Document'
}) => {
  return (
    <FileButtons 
      editor={editor} 
      onFileImport={onFileImport} 
      documentTitle={documentTitle} 
    />
  );
};
