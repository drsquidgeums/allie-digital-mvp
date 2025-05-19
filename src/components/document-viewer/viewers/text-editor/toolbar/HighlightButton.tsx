
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Highlighter } from 'lucide-react';

interface HighlightButtonProps {
  editor: Editor;
  selectedColor: string;
}

export const HighlightButton: React.FC<HighlightButtonProps> = ({ 
  editor, 
  selectedColor 
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      style={{ color: selectedColor }}
      onClick={() => editor.chain().focus().setHighlight({ color: selectedColor }).run()}
      className="h-8 w-8 p-0"
      aria-label="Highlight Text"
    >
      <Highlighter className="h-4 w-4" />
    </Button>
  );
};
