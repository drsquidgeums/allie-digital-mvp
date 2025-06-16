import React from 'react';
import { Editor } from '@tiptap/react';
import { FileButtonsSection } from './sections/FileButtonsSection';
import { HistoryButtonsSection } from './sections/HistoryButtonsSection';
import { HeadingSection } from './sections/HeadingSection';
import { FontFamilySection } from './sections/FontFamilySection';
import { FontSizeSection } from './sections/FontSizeSection';
import { TextFormatButtonsSection } from './sections/TextFormatButtonsSection';
import { HighlightButtonSection } from './sections/HighlightButtonSection';
import { TextAlignmentSection } from './sections/TextAlignmentSection';
import { ListButtonsSection } from './sections/ListButtonsSection';
import { MediaButtonsSection } from './sections/MediaButtonsSection';
import { HelpSection } from './sections/HelpSection';
import { FontColorSection } from './sections/FontColorSection';

interface EditorToolbarContentProps {
  editor: Editor;
  selectedColor: string;
  onFileImport: (content: string) => void;
  documentTitle: string;
}

export const EditorToolbarContent: React.FC<EditorToolbarContentProps> = ({
  editor,
  selectedColor,
  onFileImport,
  documentTitle,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-background border-b">
      <FileButtonsSection 
        editor={editor} 
        onFileImport={onFileImport}
        documentTitle={documentTitle}
      />
      <HistoryButtonsSection editor={editor} />
      <HeadingSection editor={editor} />
      <FontFamilySection editor={editor} />
      <FontSizeSection editor={editor} />
      <TextFormatButtonsSection editor={editor} />
      <FontColorSection editor={editor} />
      <HighlightButtonSection editor={editor} selectedColor={selectedColor} />
      <TextAlignmentSection editor={editor} />
      <ListButtonsSection editor={editor} />
      <MediaButtonsSection editor={editor} />
      <HelpSection />
    </div>
  );
};
