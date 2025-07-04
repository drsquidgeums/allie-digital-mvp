
import React from 'react';
import { Editor } from '@tiptap/react';
import { WordCountDisplay } from '../WordCountDisplay';
import { AutoSaveIndicator } from '../AutoSaveIndicator';

interface StatusSectionProps {
  editor: Editor;
  documentTitle: string;
}

export const StatusSection: React.FC<StatusSectionProps> = ({ editor, documentTitle }) => {
  return (
    <div className="flex items-center ml-auto">
      <AutoSaveIndicator editor={editor} documentTitle={documentTitle} />
      <WordCountDisplay editor={editor} />
    </div>
  );
};
