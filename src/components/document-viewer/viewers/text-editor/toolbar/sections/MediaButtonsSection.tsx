
import React from 'react';
import { Editor } from '@tiptap/react';
import { MediaButtons } from '../MediaButtons';
import { ToolbarDivider } from '../ToolbarDivider';

interface MediaButtonsSectionProps {
  editor: Editor;
}

export const MediaButtonsSection: React.FC<MediaButtonsSectionProps> = ({ editor }) => {
  return (
    <>
      <MediaButtons editor={editor} />
      <ToolbarDivider />
    </>
  );
};
