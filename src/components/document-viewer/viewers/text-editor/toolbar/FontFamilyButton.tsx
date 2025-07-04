
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Type } from 'lucide-react';

interface FontFamilyButtonProps {
  editor: Editor;
}

const fontFamilies = [
  { label: 'Default', value: 'inherit', category: 'System' },
  
  // Sans-serif fonts
  { label: 'Arial', value: 'Arial, sans-serif', category: 'Sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, sans-serif', category: 'Sans-serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif', category: 'Sans-serif' },
  { label: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif', category: 'Sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, sans-serif', category: 'Sans-serif' },
  { label: 'Century Gothic', value: 'Century Gothic, sans-serif', category: 'Sans-serif' },
  { label: 'Lucida Sans', value: 'Lucida Sans, sans-serif', category: 'Sans-serif' },
  { label: 'Segoe UI', value: 'Segoe UI, sans-serif', category: 'Sans-serif' },
  
  // Serif fonts
  { label: 'Times New Roman', value: 'Times New Roman, serif', category: 'Serif' },
  { label: 'Georgia', value: 'Georgia, serif', category: 'Serif' },
  { label: 'Garamond', value: 'Garamond, serif', category: 'Serif' },
  { label: 'Book Antiqua', value: 'Book Antiqua, serif', category: 'Serif' },
  { label: 'Palatino', value: 'Palatino, serif', category: 'Serif' },
  
  // Monospace fonts
  { label: 'Courier New', value: 'Courier New, monospace', category: 'Monospace' },
  { label: 'Monaco', value: 'Monaco, monospace', category: 'Monospace' },
  { label: 'Consolas', value: 'Consolas, monospace', category: 'Monospace' },
  
  // Accessibility-friendly fonts
  { label: 'Comic Sans MS', value: 'Comic Sans MS, cursive', category: 'Accessibility' },
  { label: 'OpenDyslexic', value: 'OpenDyslexic, sans-serif', category: 'Accessibility' },
  { label: 'Andika', value: 'Andika, sans-serif', category: 'Accessibility' },
  { label: 'Lexie Readable', value: 'Lexie Readable, sans-serif', category: 'Accessibility' },
];

const categories = ['System', 'Sans-serif', 'Serif', 'Monospace', 'Accessibility'];

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
          <Type className="h-4 w-4 mr-1" />
          Font
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto">
        {categories.map((category) => {
          const categoryFonts = fontFamilies.filter(font => font.category === category);
          if (categoryFonts.length === 0) return null;
          
          return (
            <div key={category}>
              <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1">
                {category}
              </DropdownMenuLabel>
              {categoryFonts.map((font) => (
                <DropdownMenuItem
                  key={font.value}
                  onClick={() => setFontFamily(font.value)}
                  style={{ fontFamily: font.value }}
                  className="cursor-pointer"
                >
                  {font.label}
                </DropdownMenuItem>
              ))}
              {category !== 'Accessibility' && <DropdownMenuSeparator />}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
