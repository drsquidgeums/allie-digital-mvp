
import React from 'react';
import { Editor } from '@tiptap/react';
import { FileButtonsSection } from './sections/FileButtonsSection';
import { HistoryButtonsSection } from './sections/HistoryButtonsSection';
import { HeadingSection } from './sections/HeadingSection';
import { FontFamilySection } from './sections/FontFamilySection';
import { FontSizeSection } from './sections/FontSizeSection';
import { TextFormatButtonsSection } from './sections/TextFormatButtonsSection';
import { AdvancedFormatSection } from './sections/AdvancedFormatSection';
import { HighlightButtonSection } from './sections/HighlightButtonSection';
import { TextAlignmentSection } from './sections/TextAlignmentSection';
import { ListButtonsSection } from './sections/ListButtonsSection';
import { MediaButtonsSection } from './sections/MediaButtonsSection';
import { FontColorSection } from './sections/FontColorSection';
import { DocumentStructureSection } from './sections/DocumentStructureSection';
import { AdvancedEditingSection } from './sections/AdvancedEditingSection';
import { ProductivitySection } from './sections/ProductivitySection';
import { StatusSection } from './sections/StatusSection';
import { HelpSection } from './sections/HelpSection';
import { Separator } from '@/components/ui/separator';

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
    <div className="flex flex-wrap items-center gap-1 py-2">
      {/* Row 1: Basic editing */}
      <div className="flex items-center gap-1">
        <HistoryButtonsSection editor={editor} />
        <Separator orientation="vertical" className="h-6 mx-1" />
        <HeadingSection editor={editor} />
        <Separator orientation="vertical" className="h-6 mx-1" />
        <FontFamilySection editor={editor} />
        <FontSizeSection editor={editor} />
        <Separator orientation="vertical" className="h-6 mx-1" />
        <TextFormatButtonsSection editor={editor} />
        <AdvancedFormatSection editor={editor} />
      </div>
      
      {/* Row 2: Colors and alignment */}
      <div className="flex items-center gap-1 w-full mt-1">
        <FontColorSection editor={editor} />
        <HighlightButtonSection editor={editor} selectedColor={selectedColor} />
        <Separator orientation="vertical" className="h-6 mx-1" />
        <TextAlignmentSection editor={editor} />
        <ListButtonsSection editor={editor} />
        <Separator orientation="vertical" className="h-6 mx-1" />
        <MediaButtonsSection editor={editor} />
        <Separator orientation="vertical" className="h-6 mx-1" />
        <DocumentStructureSection editor={editor} documentTitle={documentTitle} />
        <AdvancedEditingSection editor={editor} documentTitle={documentTitle} />
        <ProductivitySection editor={editor} documentTitle={documentTitle} />
        <div className="flex-1" />
        <HelpSection />
        <StatusSection editor={editor} documentTitle={documentTitle} />
      </div>
    </div>
  );
};
