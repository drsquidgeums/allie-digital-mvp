
import React from 'react';
import { Editor } from '@tiptap/react';
import { AdvancedFormatButtons } from '../AdvancedFormatButtons';
import { TextCaseButtons } from '../TextCaseButtons';
import { ToolbarDivider } from '../ToolbarDivider';

interface AdvancedFormatSectionProps {
  editor: Editor;
}

export const AdvancedFormatSection: React.FC<AdvancedFormatSectionProps> = ({ editor }) => {
  return (
    <>
      <AdvancedFormatButtons editor={editor} />
      <TextCaseButtons editor={editor} />
      <ToolbarDivider />
    </>
  );
};
