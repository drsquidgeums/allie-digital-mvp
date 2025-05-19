
import React from 'react';
import { Editor } from '@tiptap/react';
import { HistoryButtons } from '../HistoryButtons';
import { ToolbarDivider } from '../ToolbarDivider';

interface HistoryButtonsSectionProps {
  editor: Editor;
}

export const HistoryButtonsSection: React.FC<HistoryButtonsSectionProps> = ({ editor }) => {
  return (
    <>
      <HistoryButtons editor={editor} />
      <ToolbarDivider />
    </>
  );
};
