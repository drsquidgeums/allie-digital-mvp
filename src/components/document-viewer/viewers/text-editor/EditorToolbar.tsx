
import React from 'react';
import { Editor } from '@tiptap/react';
import { EditorToolbarContent } from './toolbar/EditorToolbarContent';

interface EditorToolbarProps {
  editor: Editor | null;
  selectedColor: string;
  onFileImport: (content: string) => void;
  documentTitle?: string;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  editor, 
  selectedColor,
  onFileImport,
  documentTitle = 'Untitled Document'
}) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 p-2 border-b overflow-x-auto">
      <EditorToolbarContent 
        editor={editor}
        selectedColor={selectedColor}
        onFileImport={onFileImport}
        documentTitle={documentTitle}
      />
    </div>
  );
};
