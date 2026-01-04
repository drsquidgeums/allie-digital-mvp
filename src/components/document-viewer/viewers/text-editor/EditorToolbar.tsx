
import React from 'react';
import { Editor } from '@tiptap/react';
import { EditorToolbarContent } from './toolbar/EditorToolbarContent';
import { DocumentTemplates } from './toolbar/DocumentTemplates';
import { EnhancedExportMenu } from './toolbar/file-operations/EnhancedExportMenu';
import { ImportButton } from './toolbar/file-operations/ImportButton';
import { SaveButton } from './toolbar/file-operations/SaveButton';

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
    <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top toolbar with file operations */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-2">
          <DocumentTemplates editor={editor} />
          <ImportButton onFileImport={onFileImport} />
          <SaveButton editor={editor} documentTitle={documentTitle} />
          <EnhancedExportMenu editor={editor} documentTitle={documentTitle} />
        </div>
      </div>
      
      {/* Main formatting toolbar */}
      <div className="px-4 pb-2">
        <EditorToolbarContent 
          editor={editor} 
          selectedColor={selectedColor}
          onFileImport={onFileImport}
          documentTitle={documentTitle}
        />
      </div>
    </div>
  );
};