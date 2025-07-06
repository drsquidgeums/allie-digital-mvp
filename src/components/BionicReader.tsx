
import React, { useRef, useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Eye } from "lucide-react";
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
    console.log('Processing bionic text:', input.length, 'characters');
    
    if (!input || !input.trim()) {
      return <span className="text-gray-400 italic">Enter text to see the bionic reading effect...</span>;
    }

    // Split by whitespace and filter out empty strings
    const words = input.trim().split(/\s+/).filter(word => word.length > 0);
    console.log('Processing', words.length, 'words');
    
    return words.map((word, index) => {
      const cleanWord = word.trim();
      if (!cleanWord) return null;
      
      const midPoint = Math.ceil(cleanWord.length / 2);
      const boldPart = cleanWord.slice(0, midPoint);
      const normalPart = cleanWord.slice(midPoint);
      
      return (
        <React.Fragment key={`word-${index}-${cleanWord}`}>
          <span className="inline-block">
            <strong className="font-bold text-black dark:text-white">
              {boldPart}
            </strong>
            <span className="font-normal text-gray-600 dark:text-gray-300">
              {normalPart}
            </span>
          </span>
          {index < words.length - 1 && <span> </span>}
        </React.Fragment>
      );
    }).filter(Boolean);
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
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4" />
        <h3 className="font-medium">Bionic Reader</h3>
      </div>
      
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs flex-1"
          onClick={handleGetFromEditor}
        >
          Get from Editor
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs flex-1"
          onClick={handleSendToEditor}
          disabled={!text}
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
      />
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Bionic Reading Output:
        </label>
        <div 
          ref={outputRef}
          className="border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 rounded-lg min-h-[120px] text-left focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          tabIndex={0}
        >
          <div className="leading-relaxed text-lg">
            {processBionicText(text)}
          </div>
        </div>
      </div>
    </div>
  );
};
