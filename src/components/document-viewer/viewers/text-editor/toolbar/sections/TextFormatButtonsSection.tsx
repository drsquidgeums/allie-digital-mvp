
import React from 'react';
import { Editor } from '@tiptap/react';
import { TextFormatButtons } from '../TextFormatButtons';
import { ToolbarDivider } from '../ToolbarDivider';

interface TextFormatButtonsSectionProps {
  editor: Editor;
}

export const TextFormatButtonsSection: React.FC<TextFormatButtonsSectionProps> = ({ editor }) => {
  return (
    <>
      <TextFormatButtons editor={editor} />
      <ToolbarDivider />
    </>
  );
};
