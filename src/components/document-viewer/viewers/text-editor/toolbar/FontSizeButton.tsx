
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Type } from 'lucide-react';

interface FontSizeButtonProps {
  editor: Editor;
}

const fontSizes = [
  { label: 'Small', value: '12px', class: 'text-xs' },
  { label: 'Normal', value: '14px', class: 'text-sm' },
  { label: 'Medium', value: '16px', class: 'text-base' },
  { label: 'Large', value: '18px', class: 'text-lg' },
  { label: 'X-Large', value: '20px', class: 'text-xl' },
  { label: 'XX-Large', value: '24px', class: 'text-2xl' },
];

export const FontSizeButton: React.FC<FontSizeButtonProps> = ({ editor }) => {
  const setFontSize = (size: string) => {
    editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
  };

  const removeFontSize = () => {
    editor.chain().focus().unsetMark('textStyle').run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label="Font Size"
        >
          <Type className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {fontSizes.map((fontSize) => (
          <DropdownMenuItem
            key={fontSize.value}
            onClick={() => setFontSize(fontSize.value)}
            className={fontSize.class}
          >
            {fontSize.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onClick={removeFontSize}>
          Reset Size
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
