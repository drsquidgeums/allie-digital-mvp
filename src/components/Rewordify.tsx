
import React, { useRef, useEffect } from "react";
import { SpellCheck as SpellCheckIcon } from "lucide-react";  // Use alias to ensure correct import
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { usePersistedText } from "@/hooks/usePersistedText";
import { useEditorContent } from "@/hooks/useEditorContent";
import { useToast } from "@/hooks/use-toast";

export const Rewordify = () => {
  const [text, setText] = usePersistedText("rewordify");
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const { content, getSelectedText, setEditorText } = useEditorContent();
  const { toast } = useToast();

  // Update text when editor content changes
  useEffect(() => {
    if (content.text && !text) {
      setText(content.text);
    }
  }, [content.text]);

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
      "implement": "carry out",
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
      "fundamental": "basic",
      "majority": "most",
      "methodology": "method",
      "necessitate": "need",
      "objective": "aim",
      "operational": "working",
      "optimize": "improve",
      "prerequisite": "need",
      "primary": "main",
      "prioritize": "focus on",
      "procure": "get",
      "provide": "give",
      "virtually": "almost",
      "visualize": "imagine",
      "accordingly": "so",
      "consequently": "so",
      "elaborate": "explain",
      "emphasize": "stress",
      "encounter": "meet",
      "enhance": "improve",
      "establish": "set up",
      "evaluate": "check",
      "examine": "check",
      "exemplify": "show",
      "expedite": "speed up",
      "formulate": "make",
      "generate": "make",
      "initial": "first",
      "insufficient": "not enough",
      "maintain": "keep",
      "monitor": "check",
      "persuade": "convince",
      "postpone": "delay",
      "previous": "earlier",
      "purchase": "buy",
      "realize": "know",
      "receive": "get",
      "recommend": "suggest",
      "reduce": "cut",
      "refer": "call",
      "resolve": "solve",
      "specified": "given",
      "submit": "send",
      "subsequent": "later",
      "substantial": "large",
      "suggest": "say",
      "suitable": "right",
      "summarize": "sum up",
      "superior": "better",
      "transfer": "move",
      "transform": "change",
      "transmit": "send",
      "transport": "carry",
      "ultimate": "final",
      "unique": "only one",
      "valid": "true",
      "validate": "confirm",
      "variation": "change",
      "vicinity": "area",
      "visible": "can be seen",
      "withstand": "resist"
    };

    // Process the text word by word, preserving punctuation and spacing
    return input.split(/(\s+|[.,!?;:])/g).map(segment => {
      // If it's just whitespace or punctuation, return it unchanged
      if (/^\s+$/.test(segment) || /^[.,!?;:]$/.test(segment)) {
        return segment;
      }

      // Check if the word (lowercase) exists in our dictionary
      const lowercaseWord = segment.toLowerCase();
      if (simplifications[lowercaseWord]) {
        // Preserve original capitalization
        if (segment[0] === segment[0].toUpperCase()) {
          return simplifications[lowercaseWord].charAt(0).toUpperCase() + 
                 simplifications[lowercaseWord].slice(1);
        }
        return simplifications[lowercaseWord];
      }
      return segment;
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

  // Get text from editor
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

  // Send simplified text to editor
  const handleSendToEditor = () => {
    const simplified = simplifyText(text);
    if (simplified) {
      setEditorText(simplified);
      toast({
        title: "Text applied",
        description: "Simplified text has been sent to the editor"
      });
    }
  };

  return (
    <div 
      className="p-4 space-y-4 animate-fade-in"
      role="region"
      aria-label="Rewordify Tool"
    >
      <div className="flex items-center gap-2">
        <SpellCheckIcon className="w-4 h-4" aria-hidden="true" />
        <h3 className="font-medium">Rewordify</h3>
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
          title="Send to editor"
        >
          Send to Editor
        </Button>
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
