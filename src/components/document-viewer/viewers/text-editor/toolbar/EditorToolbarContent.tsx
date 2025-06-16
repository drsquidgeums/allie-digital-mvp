
import React from 'react';
import { Editor } from '@tiptap/react';
import { HistoryButtonsSection } from './sections/HistoryButtonsSection';
import { TextFormatButtonsSection } from './sections/TextFormatButtonsSection';
import { FontSizeSection } from './sections/FontSizeSection';
import { ListButtonsSection } from './sections/ListButtonsSection';
import { MediaButtonsSection } from './sections/MediaButtonsSection';
import { HighlightButtonSection } from './sections/HighlightButtonSection';
import { FileButtonsSection } from './sections/FileButtonsSection';

interface EditorToolbarContentProps {
  editor: Editor;
  selectedColor: string;
  onFileImport: (content: string) => void;
  documentTitle?: string;
}

export const EditorToolbarContent: React.FC<EditorToolbarContentProps> = ({ 
  editor, 
  selectedColor,
  onFileImport,
  documentTitle = 'Untitled Document'
}) => {
  return (
    <>
      <HistoryButtonsSection editor={editor} />
      <TextFormatButtonsSection editor={editor} />
      <FontSizeSection editor={editor} />
      <ListButtonsSection editor={editor} />
      <MediaButtonsSection editor={editor} />
      <HighlightButtonSection editor={editor} selectedColor={selectedColor} />
      <FileButtonsSection 
        editor={editor} 
        onFileImport={onFileImport} 
        documentTitle={documentTitle} 
      />
    </>
  );
};
