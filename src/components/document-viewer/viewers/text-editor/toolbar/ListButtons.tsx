
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { List, ListOrdered } from 'lucide-react';

interface ListButtonsProps {
  editor: Editor;
}

export const ListButtons: React.FC<ListButtonsProps> = ({ editor }) => {
  return (
    <>
      <Button
        variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className="h-8 w-8 p-0"
        aria-label="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className="h-8 w-8 p-0"
        aria-label="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </>
  );
};
