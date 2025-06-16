
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ColorPicker } from "@/components/ColorPicker";

interface FontColorButtonProps {
  editor: Editor;
}

export const FontColorButton: React.FC<FontColorButtonProps> = ({ editor }) => {
  const [customColor, setCustomColor] = React.useState('#000000');
  const currentColor = editor.getAttributes('textStyle').color || '#000000';

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
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
      <DropdownMenuContent className="w-64">
        <div className="p-2">
          <ColorPicker
            label="Select Font Color"
            value={customColor}
            onChange={handleCustomColorChange}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
