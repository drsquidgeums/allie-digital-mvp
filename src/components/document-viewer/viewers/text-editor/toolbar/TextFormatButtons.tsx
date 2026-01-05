
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline } from 'lucide-react';

interface TextFormatButtonsProps {
  editor: Editor;
}

export const TextFormatButtons: React.FC<TextFormatButtonsProps> = ({ editor }) => {
  return (
    <>
      <Button
        variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="h-8 w-8 p-0"
        aria-label="Bold"
      >
        <Bold className="h-4 w-4 text-foreground" />
      </Button>
      
      <Button
        variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="h-8 w-8 p-0"
        aria-label="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleMark('underline').run()}
        className="h-8 w-8 p-0"
        aria-label="Underline"
      >
        <Underline className="h-4 w-4" />
      </Button>
    </>
  );
};
