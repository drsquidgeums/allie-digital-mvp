import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Network, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Node {
  id: string;
  text: string;
  children: Node[];
}

export const MindMap = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [newNodeText, setNewNodeText] = useState("");
  const { toast } = useToast();

  const addNode = () => {
    if (!newNodeText.trim()) return;
    
    const newNode: Node = {
      id: Math.random().toString(),
      text: newNodeText,
      children: [],
    };
    
    setNodes([...nodes, newNode]);
    setNewNodeText("");
    
    toast({
      title: "Node added",
      description: "New mind map node has been created",
    });
  };

  const renderNode = (node: Node, level: number = 0) => (
    <div
      key={node.id}
      className="flex flex-col gap-2"
      style={{ marginLeft: `${level * 20}px` }}
    >
      <div className="flex items-center gap-2 bg-background/50 p-2 rounded-lg">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span>{node.text}</span>
      </div>
      {node.children.map((child) => renderNode(child, level + 1))}
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Network className="w-4 h-4" />
        <h3 className="font-medium">Mind Map</h3>
      </div>
      <div className="flex gap-2">
        <Input
          value={newNodeText}
          onChange={(e) => setNewNodeText(e.target.value)}
          placeholder="Add a node..."
          onKeyPress={(e) => e.key === "Enter" && addNode()}
        />
        <Button onClick={addNode} size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {nodes.map((node) => renderNode(node))}
      </div>
    </div>
  );
};