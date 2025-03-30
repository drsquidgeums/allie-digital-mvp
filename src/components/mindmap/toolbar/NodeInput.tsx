
import React, { KeyboardEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NodeInputProps {
  newNodeText: string;
  setNewNodeText: (text: string) => void;
  onAddNode: () => void;
}

export const NodeInput: React.FC<NodeInputProps> = ({
  newNodeText,
  setNewNodeText,
  onAddNode,
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newNodeText.trim()) {
      e.preventDefault();
      onAddNode();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Input
          type="text"
          placeholder="Add new node..."
          value={newNodeText}
          onChange={(e) => setNewNodeText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-9 min-w-[200px] pr-10 bg-background/80 border-border/60 focus-visible:ring-primary/30"
          aria-label="Node text input"
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          onClick={onAddNode}
          disabled={!newNodeText.trim()}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-foreground/70 hover:text-foreground"
          aria-label="Add node"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
