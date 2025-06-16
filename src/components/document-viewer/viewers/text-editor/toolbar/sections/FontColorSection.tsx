
import React from 'react';
import { Editor } from '@tiptap/react';
import { FontColorButton } from '../FontColorButton';
import { ToolbarDivider } from '../ToolbarDivider';

interface FontColorSectionProps {
  editor: Editor;
}

export const FontColorSection: React.FC<FontColorSectionProps> = ({ editor }) => {
  return (
    <>
      <FontColorButton editor={editor} />
      <ToolbarDivider />
    </>
  );
};
