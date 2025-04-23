
import React, { useEffect, useRef } from 'react';
import * as rangy from 'rangy';
import { useToast } from "@/hooks/use-toast";
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';
import 'rangy/lib/rangy-textrange';

export const usePdfHighlighter = () => {
  const { toast } = useToast();
  const highlighterRef = useRef<any>(null);

  useEffect(() => {
    try {
      rangy.init();
      
      if (typeof rangy.createHighlighter !== 'function') {
        console.error('Rangy highlighter module not loaded properly');
        return;
      }

      highlighterRef.current = rangy.createHighlighter();
      
      highlighterRef.current.addClassApplier(rangy.createClassApplier('highlight', {
        ignoreWhiteSpace: true,
        tagNames: ['span', 'a', 'div', 'p', 'text']
      }));
    } catch (error) {
      console.error('Error initializing Rangy:', error);
      toast({
        title: "Error",
        description: "Failed to initialize text highlighting",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleHighlight = () => {
    if (!highlighterRef.current) {
      console.error('Highlighter not initialized');
      return;
    }
    
    try {
      const selection = rangy.getSelection();
      if (selection && selection.rangeCount > 0) {
        // Get the text being highlighted
        const selectedText = selection.toString();
        
        // Apply highlighting to the selection
        highlighterRef.current.highlightSelection('highlight', {
          exclusive: false
        });
        
        // Clear the selection
        selection.removeAllRanges();
        
        // Show success message
        toast({
          title: "Text highlighted",
          description: selectedText.length > 50 
            ? `"${selectedText.substring(0, 50)}..."` 
            : `"${selectedText}"`,
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error highlighting text:', error);
      toast({
        title: "Error",
        description: "Failed to highlight text",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeAllHighlights = () => {
    if (!highlighterRef.current) {
      console.error('Highlighter not initialized');
      return;
    }
    
    try {
      highlighterRef.current.removeAllHighlights();
      
      toast({
        title: "Highlights cleared",
        description: "All text highlights have been removed",
      });
    } catch (error) {
      console.error('Error removing highlights:', error);
      toast({
        title: "Error",
        description: "Failed to remove highlights",
        variant: "destructive",
      });
    }
  };

  return { 
    handleHighlight,
    removeAllHighlights
  };
};
