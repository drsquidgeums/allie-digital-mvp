
import React, { useState, useRef } from "react";
import { BookOpen } from "lucide-react";
import { Input } from "./ui/input";

const COLOR_GRADIENTS = {
  "Blue to Red": {
    start: "rgb(64, 64, 255)",
    middle: "rgb(128, 128, 255)",
    end: "rgb(255, 64, 64)",
    endMiddle: "rgb(255, 128, 128)"
  },
  "Green to Purple": {
    start: "rgb(34, 139, 34)",
    middle: "rgb(64, 179, 64)",
    end: "rgb(128, 0, 128)",
    endMiddle: "rgb(147, 51, 147)"
  },
  "Orange to Blue": {
    start: "rgb(255, 165, 0)",
    middle: "rgb(255, 191, 77)",
    end: "rgb(0, 71, 187)",
    endMiddle: "rgb(51, 105, 199)"
  }
};

export const BeelineReader = () => {
  const [text, setText] = useState("");
  const [selectedGradient, setSelectedGradient] = useState("Blue to Red");
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      outputRef.current?.focus();
    } else if (e.key === 'Escape') {
      setText('');
      inputRef.current?.focus();
    }
  };

  const processText = (input: string) => {
    const words = input.replace(/\s+/g, ' ').trim().split(' ');
    const colors = COLOR_GRADIENTS[selectedGradient as keyof typeof COLOR_GRADIENTS];
    
    return words.map((word, index) => (
      <span 
        key={`${word}-${index}`}
        className="inline-block"
        style={{
          color: "transparent",
          background: `linear-gradient(
            90deg,
            ${colors.start} 0%,
            ${colors.middle} 33%,
            ${colors.end} 66%,
            ${colors.endMiddle} 100%
          )`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text"
        }}
      >
        {word}{' '}
      </span>
    ));
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4" />
        <h3 className="font-medium">Beeline Reader</h3>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Color Gradient</label>
        <select
          value={selectedGradient}
          onChange={(e) => setSelectedGradient(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {Object.keys(COLOR_GRADIENTS).map((gradient) => (
            <option key={gradient} value={gradient}>
              {gradient}
            </option>
          ))}
        </select>
      </div>

      <Input
        ref={inputRef}
        placeholder="Enter text to process..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full"
        aria-label="Text input for beeline reading"
      />

      <div 
        ref={outputRef}
        className="bg-background/50 p-3 rounded-lg min-h-[100px] text-left focus:outline-none focus:ring-2 focus:ring-primary"
        tabIndex={text ? 0 : -1}
        role="region"
        aria-label="Processed beeline text"
      >
        {text && processText(text)}
      </div>
    </div>
  );
};
