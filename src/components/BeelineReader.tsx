
import React, { useState, useRef } from "react";
import { BookOpen } from "lucide-react";
import { Input } from "./ui/input";

const COLOR_GRADIENTS = {
  "Blue to Red": {
    start: "#4040FF",
    middle: "#8080FF",
    end: "#FF4040",
    endMiddle: "#FF8080"
  },
  "Green to Purple": {
    start: "#22A022",
    middle: "#40B340",
    end: "#800080",
    endMiddle: "#932893"
  },
  "Orange to Blue": {
    start: "#FFA500",
    middle: "#FFB94D",
    end: "#0047BB",
    endMiddle: "#3369C7"
  }
};

const GRADIENT_ANGLES = {
  "Horizontal": "90deg",
  "Diagonal Down": "45deg",
  "Diagonal Up": "135deg",
  "Vertical": "180deg"
};

export const BeelineReader = () => {
  const [text, setText] = useState("");
  const [selectedGradient, setSelectedGradient] = useState("Blue to Red");
  const [selectedAngle, setSelectedAngle] = useState("Diagonal Down");
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
    const colors = COLOR_GRADIENTS[selectedGradient as keyof typeof COLOR_GRADIENTS];
    const angle = GRADIENT_ANGLES[selectedAngle as keyof typeof GRADIENT_ANGLES];
    
    return (
      <div 
        style={{
          background: `linear-gradient(
            ${angle},
            ${colors.start} 0%,
            ${colors.middle} 40%,
            ${colors.end} 60%,
            ${colors.endMiddle} 100%
          )`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word"
        }}
      >
        {input}
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4" />
        <h3 className="font-medium">Beeline Reader</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Gradient Angle</label>
          <select
            value={selectedAngle}
            onChange={(e) => setSelectedAngle(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {Object.keys(GRADIENT_ANGLES).map((angle) => (
              <option key={angle} value={angle}>
                {angle}
              </option>
            ))}
          </select>
        </div>
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
        className="bg-background/50 p-3 rounded-lg min-h-[100px] text-left focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
        tabIndex={text ? 0 : -1}
        role="region"
        aria-label="Processed beeline text"
      >
        {text && processText(text)}
      </div>
    </div>
  );
};
