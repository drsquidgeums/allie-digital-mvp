
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

interface FontFamilyButtonProps {
  editor: Editor;
}

const fontFamilies = [
  { label: 'Default', value: 'inherit' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Times New Roman', value: 'Times New Roman, serif' },
  { label: 'Helvetica', value: 'Helvetica, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Courier New', value: 'Courier New, monospace' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
];

export const FontFamilyButton: React.FC<FontFamilyButtonProps> = ({ editor }) => {
  const setFontFamily = (fontFamily: string) => {
    if (fontFamily === 'inherit') {
      editor.chain().focus().unsetFontFamily().run();
    } else {
      editor.chain().focus().setFontFamily(fontFamily).run();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs"
          aria-label="Font Family"
        >
          Font
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {fontFamilies.map((font) => (
          <DropdownMenuItem
            key={font.value}
            onClick={() => setFontFamily(font.value)}
            style={{ fontFamily: font.value }}
          >
            {font.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
