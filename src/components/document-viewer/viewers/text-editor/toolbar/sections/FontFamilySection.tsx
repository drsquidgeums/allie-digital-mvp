
import React from 'react';
import { Editor } from '@tiptap/react';
import { FontFamilyButton } from '../FontFamilyButton';
import { ToolbarDivider } from '../ToolbarDivider';

interface FontFamilySectionProps {
  editor: Editor;
}

export const FontFamilySection: React.FC<FontFamilySectionProps> = ({ editor }) => {
  return (
    <>
      <FontFamilyButton editor={editor} />
      <ToolbarDivider />
    </>
  );
};
