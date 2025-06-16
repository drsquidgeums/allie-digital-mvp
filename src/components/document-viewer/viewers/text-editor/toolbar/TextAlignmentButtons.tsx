
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface TextAlignmentButtonsProps {
  editor: Editor;
}

export const TextAlignmentButtons: React.FC<TextAlignmentButtonsProps> = ({ editor }) => {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        data-active={editor.isActive({ textAlign: 'left' })}
        aria-label="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        data-active={editor.isActive({ textAlign: 'center' })}
        aria-label="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        data-active={editor.isActive({ textAlign: 'right' })}
        aria-label="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
    </>
  );
};
