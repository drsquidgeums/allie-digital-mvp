
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useEditorContent } from '@/hooks/useEditorContent';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

/**
 * Applies bionic reading formatting to text by bolding the first portion of each word
 */
const processBionicText = (text: string): string => {
  if (!text) return '';
  
  return text.split(/(\s+)/).map(word => {
    // Skip whitespace
    if (/^\s+$/.test(word)) return word;
    
    // Skip if word is too short
    if (word.length <= 1) return `<strong>${word}</strong>`;
    
    // Calculate how many characters to bold (roughly first half)
    const boldLength = Math.ceil(word.length / 2);
    const boldPart = word.slice(0, boldLength);
    const normalPart = word.slice(boldLength);
    
    return `<strong>${boldPart}</strong>${normalPart}`;
  }).join('');
};

export const BionicToggleButton: React.FC = () => {
  const { t } = useTranslation();
  const { content, updateContent } = useEditorContent();
  const [isBionicMode, setIsBionicMode] = useState(false);
  const [originalContent, setOriginalContent] = useState<string>('');

  const toggleBionicMode = () => {
    const editor = content.editor;
    
    if (!editor) {
      toast.error('No editor available');
      return;
    }

    if (isBionicMode) {
      // Turn off bionic mode - restore original content
      if (originalContent) {
        editor.commands.setContent(originalContent);
      }
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
      
      // Save current HTML content before transformation
      const savedContent = editor.getHTML();
      setOriginalContent(savedContent);
      
      // Process the text with bionic formatting
      const bionicHTML = processBionicText(textContent);
      
      // Set the new content
      editor.commands.setContent(`<p>${bionicHTML}</p>`);
      
      setIsBionicMode(true);
      toast.success('Bionic reading mode enabled');
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleBionicMode}
          className={`h-9 w-9 relative bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
            isBionicMode ? 'bg-primary text-primary-foreground ring-2 ring-primary' : ''
          }`}
          aria-label={isBionicMode ? 'Disable Bionic Reading Mode' : 'Enable Bionic Reading Mode'}
        >
          {isBionicMode ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          {isBionicMode && (
            <div 
              className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
              role="status"
              aria-label="Bionic reading mode active"
            />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom"
        className="bg-popover text-popover-foreground px-3 py-1.5 text-sm"
      >
        {isBionicMode ? 'Disable Bionic Reading' : t('tools.bionic')}
      </TooltipContent>
    </Tooltip>
  );
};
