
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CommentsSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="comments">Additional Comments</Label>
      <Textarea
        id="comments"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Please share any additional thoughts or suggestions..."
        className="min-h-[100px] text-black"
      />
    </div>
  );
};
