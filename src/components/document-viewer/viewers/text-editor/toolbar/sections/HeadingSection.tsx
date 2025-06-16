
import React from 'react';
import { Editor } from '@tiptap/react';
import { HeadingButtons } from '../HeadingButtons';
import { ToolbarDivider } from '../ToolbarDivider';

interface HeadingSectionProps {
  editor: Editor;
}

export const HeadingSection: React.FC<HeadingSectionProps> = ({ editor }) => {
  return (
    <>
      <HeadingButtons editor={editor} />
      <ToolbarDivider />
    </>
  );
};
