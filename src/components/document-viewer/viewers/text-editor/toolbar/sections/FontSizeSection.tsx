
import React from 'react';
import { Editor } from '@tiptap/react';
import { FontSizeButton } from '../FontSizeButton';
import { ToolbarDivider } from '../ToolbarDivider';

interface FontSizeSectionProps {
  editor: Editor;
}

export const FontSizeSection: React.FC<FontSizeSectionProps> = ({ editor }) => {
  return (
    <>
      <FontSizeButton editor={editor} />
      <ToolbarDivider />
    </>
  );
};
