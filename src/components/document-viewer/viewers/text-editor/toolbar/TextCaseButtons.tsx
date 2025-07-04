
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

interface TextCaseButtonsProps {
  editor: Editor;
}

export const TextCaseButtons: React.FC<TextCaseButtonsProps> = ({ editor }) => {
  const transformSelectedText = (transformation: 'uppercase' | 'lowercase' | 'capitalize') => {
    const { state } = editor;
    const { from, to } = state.selection;
    
    if (from === to) return; // No selection
    
    const selectedText = state.doc.textBetween(from, to, ' ');
    let transformedText = '';
    
    switch (transformation) {
      case 'uppercase':
        transformedText = selectedText.toUpperCase();
        break;
      case 'lowercase':
        transformedText = selectedText.toLowerCase();
        break;
      case 'capitalize':
        transformedText = selectedText.replace(/\b\w/g, l => l.toUpperCase());
        break;
    }
    
    editor.chain().focus().deleteRange({ from, to }).insertContent(transformedText).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label="Text case options"
        >
          <Type className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => transformSelectedText('uppercase')}>
          UPPERCASE
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => transformSelectedText('lowercase')}>
          lowercase
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => transformSelectedText('capitalize')}>
          Capitalize Words
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
