
import React, { useRef, useState, useEffect } from "react";
import { BookOpen, ChevronDown, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { usePersistedText } from "@/hooks/usePersistedText";
import { useEditorContent } from "@/hooks/useEditorContent";
import { useToast } from "@/hooks/use-toast";

const COLOR_GRADIENTS = {
  "Dark Green to Dark Purple": {
    start: "#006400", // Dark Green
    end: "#301934", // Dark Purple
  },
  "Brown to Blue": {
    start: "#8B4513",
    end: "#000080",
  }
};

export const BeelineReader = () => {
  const [text, setText] = usePersistedText("beeline");
  const [selectedGradient, setSelectedGradient] = useState("Dark Green to Dark Purple");
  const [angle, setAngle] = useState(45);
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
    const lines = input.split('\n');
    
    return (
      <div className="space-y-1">
        {lines.map((line, index) => {
          // For each line, apply a direct gradient from start to end color
          // This ensures the gradient is clearly visible across the text
          const gradientStyle = `linear-gradient(${angle}deg, ${colors.start}, ${colors.end})`;
          
          return (
            <p 
              key={index}
              className="min-h-[1.5em] leading-[1.5] py-[2px]"
              style={{
                backgroundImage: gradientStyle,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                textShadow: "0 0 1px rgba(255,255,255,0.1)"
              }}
            >
              {line || "\u00A0"}
            </p>
          );
        })}
      </div>
    );
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

  // Send text to editor
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
        <BookOpen className="w-4 h-4" />
        <h3 className="font-medium">Beeline Reader</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Color Gradient</label>
          <div className="relative">
            <select
              value={selectedGradient}
              onChange={(e) => setSelectedGradient(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none pr-10"
            >
              {Object.keys(COLOR_GRADIENTS).map((gradient) => (
                <option key={gradient} value={gradient}>
                  {gradient}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted-foreground" />
          </div>
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

      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs flex-1"
          onClick={handleGetFromEditor}
        >
          <ArrowDownToLine className="w-3 h-3 mr-1" />
          Get from Editor
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs flex-1"
          onClick={handleSendToEditor}
        >
          <ArrowUpFromLine className="w-3 h-3 mr-1" />
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
        aria-label="Text input for beeline reading"
      />

      <div 
        ref={outputRef}
        className="bg-white dark:bg-white p-3 rounded-lg min-h-[100px] text-left focus:outline-none focus:ring-2 focus:ring-primary overflow-auto"
        tabIndex={text ? 0 : -1}
        role="region"
        aria-label="Processed beeline text"
        style={{ height: text ? 'auto' : '150px', maxHeight: '300px' }}
      >
        {text && processText(text)}
      </div>
    </div>
  );
};
