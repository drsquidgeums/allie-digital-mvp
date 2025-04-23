
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useTextSelection = (
  pageNumber: number, 
  isHighlighter: boolean,
  handleSelectionFinished: (
    position: any,
    content: { text?: string; image?: string },
    hideTip: () => void,
    transformSelection: () => void
  ) => null | undefined
) => {
  const { toast } = useToast();

  const handleTextSelection = useCallback(() => {
    if (!isHighlighter) return;
    
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') return;
    
    const range = selection.getRangeAt(0);
    const position = {
      boundingRect: range.getBoundingClientRect(),
      rects: Array.from(range.getClientRects()),
      pageNumber
    };
    
    const content = {
      text: selection.toString()
    };
    
    handleSelectionFinished(
      position as any,
      content,
      () => {/* hide tip function */},
      () => {/* transform selection function */}
    );
    
    toast({
      title: "Highlight Added",
      description: "Text has been highlighted in the document",
    });
    
    selection.removeAllRanges();
  }, [pageNumber, isHighlighter, handleSelectionFinished, toast]);

  return { handleTextSelection };
};
