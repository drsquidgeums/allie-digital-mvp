
import React from 'react';
import { Editor } from '@tiptap/react';
import { TextCaseButtons } from '../TextCaseButtons';
import { WordCountDisplay } from '../WordCountDisplay';
import { KeyboardShortcutsButton } from '../KeyboardShortcutsButton';
import { PrintPreview } from '../PrintPreview';
import { OutlineGenerator } from '../OutlineGenerator';
import { ToolbarDivider } from '../ToolbarDivider';
import { BionicReaderButton } from '../BionicReaderButton';

interface ProductivitySectionProps {
  editor: Editor;
  documentTitle: string;
}

export const ProductivitySection: React.FC<ProductivitySectionProps> = ({ 
  editor, 
  documentTitle 
}) => {
  return (
    <>
      <TextCaseButtons editor={editor} />
      <BionicReaderButton editor={editor} />
      <ToolbarDivider />
      <OutlineGenerator editor={editor} />
      <PrintPreview editor={editor} documentTitle={documentTitle} />
      <KeyboardShortcutsButton />
      <ToolbarDivider />
      <WordCountDisplay editor={editor} />
      <ToolbarDivider />
    </>
  );
};
