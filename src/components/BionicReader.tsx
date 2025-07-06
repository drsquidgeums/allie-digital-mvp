
import React, { useRef, useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Eye, ArrowUpFromLine } from "lucide-react";
import { Button } from "./ui/button";
import { useEditorContent } from "@/hooks/useEditorContent";
import { useToast } from "@/hooks/use-toast";

export const BionicReader = () => {
  const [text, setText] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const { content, setEditorText, getSelectedText } = useEditorContent();
  const { toast } = useToast();

  // Update text when editor content changes
  useEffect(() => {
    if (content.text && !text) {
      setText(content.text);
    }
  }, [content.text]);

  const processBionicText = (input: string) => {
    // Normalize spaces and split by whitespace
    const words = input.replace(/\s+/g, ' ').trim().split(' ');
    
    return words.map((word, index) => {
      const midPoint = Math.ceil(word.length / 2);
      return (
        <span 
          key={`${word}-${index}`}
          className="inline-block mr-1"
          role="text"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              const nextElement = e.currentTarget.nextElementSibling;
              if (nextElement instanceof HTMLElement) {
                nextElement.focus();
              }
            }
            if (e.key === 'ArrowLeft') {
              const prevElement = e.currentTarget.previousElementSibling;
              if (prevElement instanceof HTMLElement) {
                prevElement.focus();
              }
            }
          }}
        >
          <strong className="font-bold text-black dark:text-white">{word.slice(0, midPoint)}</strong>
          <span className="font-normal text-gray-500 dark:text-gray-400">{word.slice(midPoint)}</span>
        </span>
      );
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      outputRef.current?.focus();
    } else if (e.key === 'Escape') {
      setText('');
      inputRef.current?.focus();
    }
  };

  // Get selected text from editor
  const handleGetFromEditor = () => {
    const selectedText = getSelectedText();
    
    if (selectedText) {
      setText(selectedText);
      toast({
        title: "Text selected",
        description: "Selected text imported from editor"
      });
    } else if (content.text) {
      setText(content.text);
      toast({
        title: "Text imported",
        description: "Full document text imported from editor"
      });
    }
  };

  // Send processed text back to editor
  const handleSendToEditor = () => {
    if (text) {
      setEditorText(text);
      toast({
        title: "Text applied",
        description: "Text has been sent to the editor"
      });
    }
  };

  return (
    <div 
      className="p-4 space-y-4 animate-fade-in"
      role="region"
      aria-label="Bionic Reader Tool"
    >
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4" aria-hidden="true" />
        <h3 className="font-medium">Bionic Reader</h3>
      </div>
      
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs flex-1"
          onClick={handleGetFromEditor}
          title="Get text from editor"
        >
          Get from Editor
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs flex-1"
          onClick={handleSendToEditor}
          title="Send text to editor"
        >
          Send to Editor
        </Button>
      </div>
      
      <Input
        ref={inputRef}
        placeholder="Enter text to process..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full"
        aria-label="Text input for bionic reading"
        aria-describedby="bionic-reader-instructions"
      />
      <div 
        id="bionic-reader-instructions" 
        className="sr-only"
      >
        Press Enter to focus on processed text, Escape to clear input. Use arrow keys to navigate through processed words.
      </div>
      
      {/* Enhanced output display area */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Bionic Reading Output:
        </label>
        <div 
          ref={outputRef}
          className="border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 rounded-lg min-h-[120px] text-left focus:outline-none focus:ring-2 focus:ring-primary shadow-lg"
          tabIndex={text ? 0 : -1}
          role="region"
          aria-label="Processed bionic text"
          aria-live="polite"
        >
          {text ? (
            <div className="leading-relaxed text-lg font-sans text-black dark:text-white">
              {processBionicText(text)}
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400 italic text-center py-8">
              Enter text above to see the bionic reading effect...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
