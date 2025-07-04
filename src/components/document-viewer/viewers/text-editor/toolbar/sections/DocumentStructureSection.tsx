
import React from 'react';
import { Editor } from '@tiptap/react';
import { OutlineGenerator } from '../OutlineGenerator';
import { DocumentSections } from '../DocumentSections';
import { HeadingNavigation } from '../HeadingNavigation';
import { PrintPreview } from '../PrintPreview';
import { ToolbarDivider } from '../ToolbarDivider';

interface DocumentStructureSectionProps {
  editor: Editor;
  documentTitle: string;
}

export const DocumentStructureSection: React.FC<DocumentStructureSectionProps> = ({ 
  editor, 
  documentTitle 
}) => {
  return (
    <>
      <OutlineGenerator editor={editor} />
      <DocumentSections editor={editor} />
      <HeadingNavigation editor={editor} />
      <PrintPreview editor={editor} documentTitle={documentTitle} />
      <ToolbarDivider />
    </>
  );
};
