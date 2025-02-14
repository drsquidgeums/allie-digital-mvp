
import React, { useState, useRef } from "react";
import { BookOpen } from "lucide-react";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";

const COLOR_GRADIENTS = {
  "Dark Gray to Gray": {
    start: "#222222",
    middle: "#444444",
    end: "#666666",
    endMiddle: "#888888"
  },
  "Green to Dark Green": {
    start: "#22A022",
    middle: "#1A801A",
    end: "#146014",
    endMiddle: "#0E400E"
  },
  "Brown to Blue": {
    start: "#8B4513",
    middle: "#A0522D",
    end: "#000080",
    endMiddle: "#0000CD"
  }
};

export const BeelineReader = () => {
  const [text, setText] = useState("");
  const [selectedGradient, setSelectedGradient] = useState("Dark Gray to Gray");
  const [angle, setAngle] = useState(45);
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
    
    return (
      <p 
        style={{
          backgroundImage: `linear-gradient(
            ${angle}deg,
            ${colors.start} 0%,
            ${colors.middle} 40%,
            ${colors.end} 60%,
            ${colors.endMiddle} 100%
          )`,
          display: "inline",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          width: "fit-content",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word"
        }}
      >
        {input}
      </p>
    );
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4" />
        <h3 className="font-medium">Beeline Reader</h3>
      </div>

      <div className="space-y-4">
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
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Gradient Angle</label>
            <span className="text-sm text-muted-foreground">{angle}°</span>
          </div>
          <Slider
            value={[angle]}
            onValueChange={(value) => setAngle(value[0])}
            min={0}
            max={360}
            step={1}
            className="w-full"
          />
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
