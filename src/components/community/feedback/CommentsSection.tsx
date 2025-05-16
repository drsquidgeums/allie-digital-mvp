
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CommentsSectionProps {
  value: string;
  onChange: (value: string) => void;
  maxWords?: number;
  currentWordCount?: number;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  value,
  onChange,
  maxWords = 500,
  currentWordCount = 0
}) => {
  const isOverLimit = maxWords && currentWordCount > maxWords;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="comments">Your Feedback</Label>
        <span className={`text-xs ${isOverLimit ? "text-red-500 font-bold" : "text-muted-foreground"}`}>
          {currentWordCount}/{maxWords} words
        </span>
      </div>
      <Textarea
        id="comments"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Please share your thoughts or suggestions..."
        className={`min-h-[150px] ${isOverLimit ? "border-red-500" : ""} text-black`}
      />
    </div>
  );
};
