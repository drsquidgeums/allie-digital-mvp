import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote, Type, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnnotationToolsProps {
  onAddComment: (comment: string) => void;
  onSaveAnnotations: () => void;
}

export const AnnotationTools = ({ onAddComment, onSaveAnnotations }: AnnotationToolsProps) => {
  const [comment, setComment] = React.useState("");
  const { toast } = useToast();

  const handleAddComment = () => {
    if (comment.trim()) {
      onAddComment(comment);
      setComment("");
      toast({
        title: "Comment added",
        description: "Your comment has been added to the document",
      });
    }
  };

  return (
    <div className="space-y-4 p-4 border-t border-border">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSaveAnnotations}
          className="flex items-center gap-2"
        >
          <StickyNote className="h-4 w-4" />
          Save Annotations
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="text-sm font-medium">Add Comment</span>
        </div>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Type your comment here..."
          className="min-h-[100px]"
        />
        <Button
          onClick={handleAddComment}
          disabled={!comment.trim()}
          className="w-full"
        >
          Add Comment
        </Button>
      </div>
    </div>
  );
};