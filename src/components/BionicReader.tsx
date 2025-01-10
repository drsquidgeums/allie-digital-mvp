import React, { useState, useRef } from "react";
import { Input } from "./ui/input";
import { Eye } from "lucide-react";

export const BionicReader = () => {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const processBionicText = (input: string) => {
    return input.split(' ').map((word, index) => {
      const midPoint = Math.ceil(word.length / 2);
      return (
        <span 
          key={`${word}-${index}`}
          className="inline-block"
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
          <strong>{word.slice(0, midPoint)}</strong>
          {word.slice(midPoint)}
          {' '}
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

  return (
    <div 
      className="p-4 space-y-4"
      role="region"
      aria-label="Bionic Reader Tool"
    >
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4" aria-hidden="true" />
        <h3 className="font-medium">Bionic Reader</h3>
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
      <div 
        ref={outputRef}
        className="bg-background/50 p-3 rounded-lg min-h-[100px] text-left focus:outline-none focus:ring-2 focus:ring-primary"
        tabIndex={text ? 0 : -1}
        role="region"
        aria-label="Processed bionic text"
        aria-live="polite"
      >
        {text && processBionicText(text)}
      </div>
    </div>
  );
};