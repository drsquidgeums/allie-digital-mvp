
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Image, Link } from 'lucide-react';

interface MediaButtonsProps {
  editor: Editor;
}

export const MediaButtons: React.FC<MediaButtonsProps> = ({ editor }) => {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const url = window.prompt('Enter image URL:');
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="h-8 w-8 p-0"
        aria-label="Insert Image"
      >
        <Image className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('link') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => {
          const url = window.prompt('Enter URL:');
          if (url) {
            // Check if text is selected
            if (editor.state.selection.empty) {
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            } else {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }
        }}
        className="h-8 w-8 p-0"
        aria-label="Insert Link"
      >
        <Link className="h-4 w-4" />
      </Button>
    </>
  );
};
