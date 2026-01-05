
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Undo, Redo, TextSelect } from 'lucide-react';

interface HistoryButtonsProps {
  editor: Editor;
}

export const HistoryButtons: React.FC<HistoryButtonsProps> = ({ editor }) => {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="h-8 w-8 p-0"
        aria-label="Undo"
      >
        <Undo className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="h-8 w-8 p-0"
        aria-label="Redo"
      >
        <Redo className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().selectAll().run()}
        className="h-8 w-8 p-0"
        aria-label="Select All"
        title="Select All (Ctrl+A)"
      >
        <TextSelect className="h-4 w-4" />
      </Button>
    </>
  );
};
