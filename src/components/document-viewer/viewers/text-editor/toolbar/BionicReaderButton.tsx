
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { applyBionicFormatting, removeBionicFormatting } from '../bionicUtils';
import { toast } from 'sonner';

interface BionicReaderButtonProps {
  editor: Editor;
}

export const BionicReaderButton: React.FC<BionicReaderButtonProps> = ({ editor }) => {
  const [isBionicMode, setIsBionicMode] = useState(false);
  const [originalContent, setOriginalContent] = useState<string>('');

  const toggleBionicMode = () => {
    if (!editor) return;

    if (isBionicMode) {
      // Turn off bionic mode - restore original content
      removeBionicFormatting(editor, originalContent);
      setOriginalContent('');
      setIsBionicMode(false);
      toast.success('Bionic reading mode disabled');
    } else {
      // Turn on bionic mode - apply formatting
      const textContent = editor.getText();
      
      if (!textContent.trim()) {
        toast.error('No text to apply bionic reading effect');
        return;
      }
      
      const savedContent = applyBionicFormatting(editor);
      setOriginalContent(savedContent);
      setIsBionicMode(true);
      toast.success('Bionic reading mode enabled');
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isBionicMode ? "secondary" : "ghost"}
          size="icon"
          onClick={toggleBionicMode}
          className={`h-8 w-8 ${isBionicMode ? 'bg-primary/20 text-primary' : ''}`}
          aria-label={isBionicMode ? 'Disable Bionic Reading Mode' : 'Enable Bionic Reading Mode'}
        >
          {isBionicMode ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isBionicMode ? 'Disable Bionic Reading Mode' : 'Enable Bionic Reading Mode'}</p>
      </TooltipContent>
    </Tooltip>
  );
};
