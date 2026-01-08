
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useEditorContent } from '@/hooks/useEditorContent';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';

/**
 * Applies bionic reading formatting to a single word
 */
const processBionicWord = (word: string): string => {
  if (!word || /^\s+$/.test(word)) return word;
  
  // Skip if word is too short
  if (word.length <= 1) return `<strong>${word}</strong>`;
  
  // Calculate how many characters to bold (roughly first half)
  const boldLength = Math.ceil(word.length / 2);
  const boldPart = word.slice(0, boldLength);
  const normalPart = word.slice(boldLength);
  
  return `<strong>${boldPart}</strong>${normalPart}`;
};

/**
 * Applies bionic reading formatting to HTML while preserving structure
 * Processes text content within HTML elements without destroying formatting
 */
const applyBionicToHTML = (html: string): string => {
  // Sanitize input HTML to prevent XSS
  const sanitizedHtml = DOMPurify.sanitize(html);
  
  // Create a temporary container to parse HTML
  const container = document.createElement('div');
  container.innerHTML = sanitizedHtml;
  
  // Process all text nodes
  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text.trim()) {
        // Process each word in the text
        const processedText = text.split(/(\s+)/).map(word => {
          if (/^\s+$/.test(word)) return word;
          return processBionicWord(word);
        }).join('');
        
        // Create a span to hold the processed HTML
        const span = document.createElement('span');
        span.innerHTML = processedText;
        
        // Replace text node with the new content
        if (node.parentNode) {
          // Insert all child nodes of span before the text node
          while (span.firstChild) {
            node.parentNode.insertBefore(span.firstChild, node);
          }
          node.parentNode.removeChild(node);
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Skip if it's already a strong tag (avoid double processing)
      if ((node as Element).tagName.toLowerCase() === 'strong') {
        return;
      }
      // Process child nodes (make a copy of childNodes since we're modifying)
      Array.from(node.childNodes).forEach(child => processNode(child));
    }
  };
  
  processNode(container);
  // Sanitize output to ensure no XSS in modified content
  return DOMPurify.sanitize(container.innerHTML);
};

/**
 * Removes bionic formatting (strong tags) while preserving the text content and other formatting
 */
const removeBionicFormatting = (html: string): string => {
  // Sanitize input HTML to prevent XSS
  const sanitizedHtml = DOMPurify.sanitize(html);
  
  // Create a temporary container to parse HTML
  const container = document.createElement('div');
  container.innerHTML = sanitizedHtml;
  
  // Find all strong elements and unwrap them
  const strongElements = container.querySelectorAll('strong');
  strongElements.forEach(strong => {
    const parent = strong.parentNode;
    if (parent) {
      // Move all children of strong before the strong element
      while (strong.firstChild) {
        parent.insertBefore(strong.firstChild, strong);
      }
      // Remove the now-empty strong element
      parent.removeChild(strong);
    }
  });
  
  // Normalize to merge adjacent text nodes
  container.normalize();
  
  return container.innerHTML;
};

export const BionicToggleButton: React.FC = () => {
  const { t } = useTranslation();
  const { content } = useEditorContent();
  const [isBionicMode, setIsBionicMode] = useState(false);

  const toggleBionicMode = () => {
    const editor = content.editor;
    
    if (!editor) {
      toast.error('No editor available');
      return;
    }

    if (isBionicMode) {
      // Turn off bionic mode - remove strong tags from current content
      const currentHTML = editor.getHTML();
      const cleanedHTML = removeBionicFormatting(currentHTML);
      editor.commands.setContent(cleanedHTML);
      setIsBionicMode(false);
      toast.success('Bionic reading mode disabled');
    } else {
      // Turn on bionic mode - apply formatting while preserving structure
      const textContent = editor.getText();
      
      if (!textContent.trim()) {
        toast.error('No text to apply bionic reading effect');
        return;
      }
      
      // Get HTML and apply bionic formatting while preserving structure
      const currentHTML = editor.getHTML();
      const bionicHTML = applyBionicToHTML(currentHTML);
      
      editor.commands.setContent(bionicHTML);
      
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
