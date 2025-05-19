
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Highlighter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { IRLEN_COLORS } from '@/components/irlen/constants';

interface HighlightButtonProps {
  editor: Editor;
  selectedColor: string;
}

export const HighlightButton: React.FC<HighlightButtonProps> = ({ 
  editor, 
  selectedColor 
}) => {
  const [highlightColor, setHighlightColor] = useState(selectedColor || 'rgba(255, 255, 0, 0.2)');
  
  // Set a highlight with the given color
  const setHighlight = (color: string) => {
    setHighlightColor(color);
    editor.chain().focus().toggleHighlight({ color }).run();
  };
  
  // Check if highlight is active
  const isHighlightActive = () => editor.isActive('highlight');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isHighlightActive() ? "secondary" : "ghost"}
          size="sm"
          style={{ color: isHighlightActive() ? highlightColor : undefined }}
          className="h-8 w-8 p-0 relative"
          aria-label="Highlight Text"
        >
          <Highlighter className="h-4 w-4" />
          {isHighlightActive() && (
            <div 
              className="w-1 h-1 absolute bottom-1 right-1 rounded-full"
              style={{ backgroundColor: highlightColor }}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="dark:bg-[#333333] dark:border dark:border-white/20 dark:text-[#FAFAFA]">
        <div className="space-y-2 p-2">
          <div className="font-medium text-sm mb-2">Highlight Colors</div>
          <div className="grid grid-cols-1 gap-2">
            {IRLEN_COLORS.map((color) => (
              <DropdownMenuItem 
                key={color.name}
                onClick={() => setHighlight(color.value)}
                className="flex items-center gap-2 dark:hover:bg-[#444444] dark:focus:bg-[#444444] cursor-pointer"
              >
                <div 
                  className="w-4 h-4 rounded border border-border"
                  style={{ backgroundColor: color.value }} 
                  role="presentation"
                />
                <span>{color.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem 
              onClick={() => editor.chain().focus().unsetHighlight().run()}
              className="border-t mt-1 pt-1 dark:hover:bg-[#444444] dark:focus:bg-[#444444] cursor-pointer"
            >
              Remove Highlight
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
