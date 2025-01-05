import React, { useState } from "react";
import { Input } from "./ui/input";
import { Eye } from "lucide-react";

export const BionicReader = () => {
  const [text, setText] = useState("");

  const processBionicText = (input: string) => {
    return input.split(' ').map(word => {
      const midPoint = Math.ceil(word.length / 2);
      return (
        <span key={Math.random()}>
          <strong>{word.slice(0, midPoint)}</strong>
          {word.slice(midPoint)}
          {' '}
        </span>
      );
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4" />
        <h3 className="font-medium">Bionic Reader</h3>
      </div>
      <Input
        placeholder="Enter text to process..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full"
      />
      <div className="bg-background/50 p-3 rounded-lg min-h-[100px] text-left">
        {text && processBionicText(text)}
      </div>
    </div>
  );
};
