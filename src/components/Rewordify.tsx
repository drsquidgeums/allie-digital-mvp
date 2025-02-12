
import React, { useState, useRef } from "react";
import { SpellCheck } from "lucide-react";
import { Input } from "./ui/input";

export const Rewordify = () => {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const simplifyText = (input: string) => {
    // Simple word replacements dictionary
    const simplifications: { [key: string]: string } = {
      "therefore": "so",
      "however": "but",
      "nevertheless": "still",
      "approximately": "about",
      "sufficient": "enough",
      "require": "need",
      "utilize": "use",
      "implement": "use",
      "facilitate": "help",
      "terminate": "end",
      "additionally": "also",
      "numerous": "many",
      "assist": "help",
      "obtain": "get",
      "regarding": "about",
      "indicate": "show",
      "demonstrate": "show",
      "subsequently": "later",
      "furthermore": "also",
      "initiate": "start"
    };

    let simplifiedText = input;
    Object.entries(simplifications).forEach(([complex, simple]) => {
      const regex = new RegExp(`\\b${complex}\\b`, 'gi');
      simplifiedText = simplifiedText.replace(regex, simple);
    });

    return simplifiedText;
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
      className="p-4 space-y-4 animate-fade-in"
      role="region"
      aria-label="Rewordify Tool"
    >
      <div className="flex items-center gap-2">
        <SpellCheck className="w-4 h-4" aria-hidden="true" />
        <h3 className="font-medium">Rewordify</h3>
      </div>
      <Input
        ref={inputRef}
        placeholder="Enter text to simplify..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full"
        aria-label="Text input for simplification"
        aria-describedby="rewordify-instructions"
      />
      <div 
        id="rewordify-instructions" 
        className="sr-only"
      >
        Press Enter to focus on simplified text, Escape to clear input.
      </div>
      <div 
        ref={outputRef}
        className="bg-background/50 p-3 rounded-lg min-h-[100px] text-left focus:outline-none focus:ring-2 focus:ring-primary"
        tabIndex={text ? 0 : -1}
        role="region"
        aria-label="Simplified text output"
        aria-live="polite"
      >
        {text && simplifyText(text)}
      </div>
    </div>
  );
};
