
import { useEffect, useRef } from 'react';
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
      // Initialize rangy
      if (!rangy.initialized) {
        rangy.init();
        console.log('Rangy initialized successfully:', rangy.initialized);
      }
      
      if (typeof rangy.createHighlighter !== 'function') {
        console.error('Rangy highlighter module not loaded properly');
        return;
      }

      // Create highlighter
      highlighterRef.current = rangy.createHighlighter();
      
      // Add a class applier for the highlight CSS class
      highlighterRef.current.addClassApplier(rangy.createClassApplier('highlight', {
        ignoreWhiteSpace: true,
        tagNames: ['span', 'div', 'a', 'p']
      }));
      
      console.log('Highlighter created successfully');
    } catch (error) {
      console.error('Error initializing Rangy:', error);
      toast({
        title: "Error",
        description: "Failed to initialize text highlighting",
        variant: "destructive",
      });
    }
    
    // Cleanup function
    return () => {
      try {
        // Remove any highlighter instances or cleanup if needed
        if (highlighterRef.current && typeof highlighterRef.current.removeAllHighlights === 'function') {
          highlighterRef.current.removeAllHighlights();
        }
      } catch (error) {
        console.error('Error cleaning up highlighter:', error);
      }
    };
  }, [toast]);

  const handleHighlight = () => {
    if (!highlighterRef.current) {
      console.error('Highlighter not initialized');
      return;
    }
    
    try {
      // Get the current selection
      const selection = rangy.getSelection();
      console.log('Current selection:', selection);
      
      if (selection.rangeCount > 0) {
        // Apply highlight to the selection
        highlighterRef.current.highlightSelection('highlight', {
          exclusive: false
        });
        
        // Notify the user
        toast({
          title: "Text highlighted",
          description: "Selection has been highlighted",
        });
        
        // Clear the selection to avoid UI clutter
        selection.removeAllRanges();
      } else {
        console.log('No text selected to highlight');
      }
    } catch (error) {
      console.error('Error highlighting text:', error);
      toast({
        title: "Error",
        description: "Failed to highlight text",
        variant: "destructive",
      });
    }
  };

  return { handleHighlight };
};
