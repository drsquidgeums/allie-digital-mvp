
import React from 'react';
import { Editor } from '@tiptap/react';
import { HistoryButtonsSection } from './sections/HistoryButtonsSection';
import { TextFormatButtonsSection } from './sections/TextFormatButtonsSection';
import { FontFamilySection } from './sections/FontFamilySection';
import { FontSizeSection } from './sections/FontSizeSection';
import { HeadingSection } from './sections/HeadingSection';
import { TextAlignmentSection } from './sections/TextAlignmentSection';
import { ListButtonsSection } from './sections/ListButtonsSection';
import { MediaButtonsSection } from './sections/MediaButtonsSection';
import { HighlightButtonSection } from './sections/HighlightButtonSection';
import { FileButtonsSection } from './sections/FileButtonsSection';
import { HelpSection } from './sections/HelpSection';
import { WordCountDisplay } from './WordCountDisplay';

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
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-1 flex-wrap">
        <HistoryButtonsSection editor={editor} />
        <TextFormatButtonsSection editor={editor} />
        <FontFamilySection editor={editor} />
        <FontSizeSection editor={editor} />
        <HeadingSection editor={editor} />
        <TextAlignmentSection editor={editor} />
        <ListButtonsSection editor={editor} />
        <MediaButtonsSection editor={editor} />
        <HighlightButtonSection editor={editor} selectedColor={selectedColor} />
        <FileButtonsSection 
          editor={editor} 
          onFileImport={onFileImport} 
          documentTitle={documentTitle} 
        />
        <HelpSection />
      </div>
      <WordCountDisplay editor={editor} />
    </div>
  );
};
