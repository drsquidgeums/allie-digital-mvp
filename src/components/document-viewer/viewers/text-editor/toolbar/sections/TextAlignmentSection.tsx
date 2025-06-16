
import React from 'react';
import { Editor } from '@tiptap/react';
import { TextAlignmentButtons } from '../TextAlignmentButtons';
import { ToolbarDivider } from '../ToolbarDivider';

interface TextAlignmentSectionProps {
  editor: Editor;
}

export const TextAlignmentSection: React.FC<TextAlignmentSectionProps> = ({ editor }) => {
  return (
    <>
      <TextAlignmentButtons editor={editor} />
      <ToolbarDivider />
    </>
  );
};
