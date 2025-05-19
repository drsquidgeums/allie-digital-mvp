
import React from 'react';
import { Editor } from '@tiptap/react';
import { HistoryButtons } from './toolbar/HistoryButtons';
import { TextFormatButtons } from './toolbar/TextFormatButtons';
import { ListButtons } from './toolbar/ListButtons';
import { MediaButtons } from './toolbar/MediaButtons';
import { HighlightButton } from './toolbar/HighlightButton';
import { FileButtons } from './toolbar/FileButtons';
import { ToolbarDivider } from './toolbar/ToolbarDivider';

interface EditorToolbarProps {
  editor: Editor | null;
  selectedColor: string;
  onFileImport: (content: string) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  editor, 
  selectedColor,
  onFileImport
}) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 p-2 border-b overflow-x-auto">
      <HistoryButtons editor={editor} />
      
      <ToolbarDivider />
      
      <TextFormatButtons editor={editor} />
      
      <ToolbarDivider />
      
      <ListButtons editor={editor} />
      
      <ToolbarDivider />
      
      <MediaButtons editor={editor} />
      
      <ToolbarDivider />
      
      <HighlightButton editor={editor} selectedColor={selectedColor} />
      
      <ToolbarDivider />
      
      <FileButtons editor={editor} onFileImport={onFileImport} />
    </div>
  );
};
