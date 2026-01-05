
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { RemoveFormatting } from 'lucide-react';

interface ClearFormattingButtonProps {
  editor: Editor;
}

export const ClearFormattingButton: React.FC<ClearFormattingButtonProps> = ({ editor }) => {
  const handleClearFormatting = () => {
    editor.chain().focus().unsetAllMarks().clearNodes().run();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClearFormatting}
      className="h-8 w-8 p-0"
      aria-label="Clear formatting"
      title="Clear formatting"
    >
      <RemoveFormatting className="h-4 w-4" />
    </Button>
  );
};
