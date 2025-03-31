
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/utils/errorHandling';

/**
 * Shared utilities for working with text highlights across different document types
 */
export const useHighlightUtils = (initialColor: string = '#ffeb3b') => {
  const [selectedColor, setSelectedColor] = useState<string>(initialColor);
  const { toast } = useToast();
  
  /**
   * Announces messages for accessibility
   */
  const announceHighlightAction = (message: string, elementRef?: React.RefObject<HTMLElement>) => {
    if (elementRef?.current) {
      elementRef.current.textContent = message;
    }
    
    // Create a live region if no ref is provided
    if (!elementRef) {
      const liveRegion = document.getElementById('highlight-announcer') || 
        (() => {
          const el = document.createElement('div');
          el.id = 'highlight-announcer';
          el.setAttribute('aria-live', 'polite');
          el.className = 'sr-only';
          document.body.appendChild(el);
          return el;
        })();
        
      liveRegion.textContent = message;
    }
  };
  
  /**
   * Safely extracts text from highlight content
   */
  const getHighlightText = (content: { text?: string } | undefined, maxLength: number = 20): string => {
    if (!content?.text) return '';
    
    const text = content.text;
    if (text.length <= maxLength) return text;
    
    return `${text.substring(0, maxLength)}...`;
  };
  
  /**
   * Shows a toast notification for highlight actions
   */
  const notifyHighlightAction = (
    action: 'add' | 'update' | 'remove', 
    content?: { text?: string } | undefined
  ) => {
    try {
      const displayText = getHighlightText(content);
      
      switch (action) {
        case 'add':
          toast({
            title: "Highlight Added",
            description: displayText ? `"${displayText}"` : "Text has been highlighted"
          });
          break;
        case 'update':
          toast({
            title: "Highlight Updated",
            description: "The highlight color has been changed"
          });
          break;
        case 'remove':
          toast({
            title: "Highlight Removed",
            description: "The highlight has been removed from the document"
          });
          break;
      }
    } catch (error) {
      handleError(error, { 
        title: "Highlight Notification Error", 
        showToast: false 
      });
    }
  };

  return {
    selectedColor,
    setSelectedColor,
    announceHighlightAction,
    getHighlightText,
    notifyHighlightAction
  };
};
