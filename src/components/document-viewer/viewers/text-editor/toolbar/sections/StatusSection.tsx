
import React from 'react';
import { Editor } from '@tiptap/react';
import { AutoSaveIndicator } from '../AutoSaveIndicator';

interface StatusSectionProps {
  editor: Editor;
  documentTitle: string;
}

export const StatusSection: React.FC<StatusSectionProps> = ({ 
  editor, 
  documentTitle 
}) => {
  return (
    <div className="ml-auto">
      <AutoSaveIndicator editor={editor} documentTitle={documentTitle} />
    </div>
  );
};
