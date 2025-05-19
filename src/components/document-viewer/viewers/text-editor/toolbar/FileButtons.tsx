
import React from 'react';
import { Editor } from '@tiptap/react';
import { ImportButton } from './file-operations/ImportButton';
import { SaveButton } from './file-operations/SaveButton';
import { ExportMenu } from './file-operations/ExportMenu';

interface FileButtonsProps {
  editor: Editor;
  onFileImport: (content: string) => void;
  documentTitle?: string;
}

export const FileButtons: React.FC<FileButtonsProps> = ({ 
  editor,
  onFileImport,
  documentTitle = 'Untitled Document'
}) => {
  return (
    <>
      <ImportButton onFileImport={onFileImport} />
      <SaveButton editor={editor} documentTitle={documentTitle} />
      <ExportMenu editor={editor} documentTitle={documentTitle} />
    </>
  );
};
