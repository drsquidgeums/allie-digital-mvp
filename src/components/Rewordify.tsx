
import React, { useState, useRef } from "react";
import { SpellCheck } from "lucide-react";
import { Input } from "./ui/input";

export const Rewordify = () => {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const simplifyText = (input: string) => {
    // Expanded dictionary of complex words and their simpler alternatives
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
      "initiate": "start",
      "commence": "begin",
      "constitute": "form",
      "endeavor": "try",
      "facilitate": "help",
      "fundamental": "basic",
      "implement": "carry out",
      "indicate": "show",
      "initiate": "begin",
      "majority": "most",
      "methodology": "method",
      "necessitate": "need",
      "objective": "aim",
      "operational": "working",
      "optimize": "improve",
      "prerequisite": "requirement",
      "primary": "main",
      "prioritize": "focus on",
      "procure": "get",
      "provide": "give",
      "regarding": "about",
      "subsequently": "then",
      "sufficient": "enough",
      "utilize": "use",
      "virtually": "almost",
      "visualize": "imagine"
    };

    // Process the text word by word
    return input.split(/\b/).map(word => {
      // Check if the word (lowercase) exists in our dictionary
      const lowercaseWord = word.toLowerCase();
      if (simplifications[lowercaseWord]) {
        // Preserve original capitalization
        if (word[0] === word[0].toUpperCase()) {
          return simplifications[lowercaseWord].charAt(0).toUpperCase() + 
                 simplifications[lowercaseWord].slice(1);
        }
        return simplifications[lowercaseWord];
      }
      return word;
    }).join('');
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
