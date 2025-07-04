
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Type, CaseSensitive } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TextCaseButtonsProps {
  editor: Editor;
}

export const TextCaseButtons: React.FC<TextCaseButtonsProps> = ({ editor }) => {
  const applyTextCase = (caseType: 'uppercase' | 'lowercase' | 'capitalize' | 'toggle') => {
    const { state } = editor;
    const { from, to } = state.selection;
    
    if (from === to) return; // No selection
    
    const selectedText = state.doc.textBetween(from, to, ' ');
    let transformedText = '';
    
    switch (caseType) {
      case 'uppercase':
        transformedText = selectedText.toUpperCase();
        break;
      case 'lowercase':
        transformedText = selectedText.toLowerCase();
        break;
      case 'capitalize':
        transformedText = selectedText.replace(/\b\w/g, char => char.toUpperCase());
        break;
      case 'toggle':
        transformedText = selectedText === selectedText.toUpperCase() 
          ? selectedText.toLowerCase() 
          : selectedText.toUpperCase();
        break;
    }
    
    editor.chain().focus().deleteRange({ from, to }).insertContent(transformedText).run();
  };

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => applyTextCase('uppercase')}
            aria-label="Convert to uppercase"
          >
            <Type className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Convert to UPPERCASE</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => applyTextCase('lowercase')}
            aria-label="Convert to lowercase"
          >
            <CaseSensitive className="h-4 w-4 scale-75" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Convert to lowercase</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => applyTextCase('capitalize')}
            aria-label="Capitalize words"
          >
            Aa
          </Button>
        </TooltipTrigger>
        <TooltipContent>Capitalize Each Word</TooltipContent>
      </Tooltip>
    </div>
  );
};
