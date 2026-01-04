
import React from 'react';
import { Editor } from '@tiptap/react';
import { AdvancedSearch } from '../AdvancedSearch';
import { ToolbarDivider } from '../ToolbarDivider';

interface AdvancedEditingSectionProps {
  editor: Editor;
  documentTitle: string;
}

export const AdvancedEditingSection: React.FC<AdvancedEditingSectionProps> = ({ 
  editor, 
  documentTitle 
}) => {
  return (
    <>
      <AdvancedSearch editor={editor} />
      <ToolbarDivider />
    </>
  );
};
