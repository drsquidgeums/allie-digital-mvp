
import React from 'react';
import { Editor } from '@tiptap/react';
import { ListButtons } from '../ListButtons';
import { ToolbarDivider } from '../ToolbarDivider';

interface ListButtonsSectionProps {
  editor: Editor;
}

export const ListButtonsSection: React.FC<ListButtonsSectionProps> = ({ editor }) => {
  return (
    <>
      <ListButtons editor={editor} />
      <ToolbarDivider />
    </>
  );
};
