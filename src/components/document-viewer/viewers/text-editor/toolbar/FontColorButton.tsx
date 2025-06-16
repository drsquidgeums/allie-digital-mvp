
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FontColorButtonProps {
  editor: Editor;
}

const colorOptions = [
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Gray', value: '#6b7280' },
  { name: 'White', value: '#ffffff' },
];

export const FontColorButton: React.FC<FontColorButtonProps> = ({ editor }) => {
  const currentColor = editor.getAttributes('textStyle').color || '#000000';

  const handleColorChange = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 relative"
                aria-label="Change font color"
              >
                <Palette className="h-4 w-4" />
                <div 
                  className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-0.5 rounded"
                  style={{ backgroundColor: currentColor }}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Font Color</TooltipContent>
          </Tooltip>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {colorOptions.map((color) => (
          <DropdownMenuItem
            key={color.value}
            onClick={() => handleColorChange(color.value)}
            className="flex items-center gap-2"
          >
            <div 
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: color.value }}
            />
            {color.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
