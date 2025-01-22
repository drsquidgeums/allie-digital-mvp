import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddNode();
      toast("Node added successfully");
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setNewNodeText('');
      (e.target as HTMLElement).blur();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        value={newNodeText}
        onChange={(e) => setNewNodeText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a node..."
        className="w-64 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="New node text"
      />
      <Button 
        onClick={() => {
          onAddNode();
          toast("Node added successfully");
        }} 
        size="icon" 
        variant="outline" 
        className="bg-background hover:bg-accent focus:ring-2 focus:ring-ring"
        aria-label="Add node"
      >
        <Plus className="w-4 h-4 text-foreground" aria-hidden="true" />
      </Button>
    </div>
  );
};