
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Subscript, Superscript, Code } from 'lucide-react';

interface AdvancedFormatButtonsProps {
  editor: Editor;
}

export const AdvancedFormatButtons: React.FC<AdvancedFormatButtonsProps> = ({ editor }) => {
  return (
    <>
      <Button
        variant={editor.isActive('subscript') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className="h-8 w-8 p-0"
        aria-label="Subscript"
      >
        <Subscript className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('superscript') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className="h-8 w-8 p-0"
        aria-label="Superscript"
      >
        <Superscript className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('code') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className="h-8 w-8 p-0"
        aria-label="Inline code"
      >
        <Code className="h-4 w-4" />
      </Button>
    </>
  );
};
