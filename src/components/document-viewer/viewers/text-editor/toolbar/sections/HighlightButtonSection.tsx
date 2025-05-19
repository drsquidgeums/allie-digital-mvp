
import React from 'react';
import { Editor } from '@tiptap/react';
import { HighlightButton } from '../HighlightButton';
import { ToolbarDivider } from '../ToolbarDivider';

interface HighlightButtonSectionProps {
  editor: Editor;
  selectedColor: string;
}

export const HighlightButtonSection: React.FC<HighlightButtonSectionProps> = ({ editor, selectedColor }) => {
  return (
    <>
      <HighlightButton editor={editor} selectedColor={selectedColor} />
      <ToolbarDivider />
    </>
  );
};
