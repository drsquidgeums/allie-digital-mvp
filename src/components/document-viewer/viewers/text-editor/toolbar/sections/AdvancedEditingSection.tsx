
import React from 'react';
import { Editor } from '@tiptap/react';
import { AdvancedSearch } from '../AdvancedSearch';
import { DocumentComparison } from '../DocumentComparison';
import { VersionHistory } from '../VersionHistory';
import { CollaborationIndicator } from '../CollaborationIndicator';
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
      <DocumentComparison editor={editor} documentTitle={documentTitle} />
      <VersionHistory editor={editor} documentTitle={documentTitle} />
      <CollaborationIndicator editor={editor} />
      <ToolbarDivider />
    </>
  );
};
