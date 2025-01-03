import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
} from '@xyflow/react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Network, Plus, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Main Topic' },
    position: { x: 250, y: 0 },
    style: {
      background: '#f3f4f6',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
    },
  },
];

export const MindMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [newNodeText, setNewNodeText] = useState("");
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = () => {
    if (!newNodeText.trim()) return;
    
    const newNode = {
      id: `${nodes.length + 1}`,
      data: { label: newNodeText },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      style: {
        background: '#f3f4f6',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    setNewNodeText("");
    
    toast({
      title: "Node added",
      description: "New mind map node has been created",
    });
  };

  const exportToJson = () => {
    const data = { nodes, edges };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'mindmap.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);

    toast({
      title: "Mind map exported",
      description: "Your mind map has been exported as JSON",
    });
  };

  const clearCanvas = () => {
    setNodes(initialNodes);
    setEdges([]);
    
    toast({
      title: "Canvas cleared",
      description: "Mind map has been reset to initial state",
    });
  };

  return (
    <div className="w-full h-[600px] bg-background rounded-lg border">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4" />
          <h3 className="font-medium">Mind Map</h3>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={newNodeText}
            onChange={(e) => setNewNodeText(e.target.value)}
            placeholder="Add a node..."
            className="w-64"
            onKeyPress={(e) => e.key === "Enter" && addNode()}
          />
          <Button onClick={addNode} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
          <Button onClick={exportToJson} variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
          <Button onClick={clearCanvas} variant="outline" size="icon">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className="bg-background"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};