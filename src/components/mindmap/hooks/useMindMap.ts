import { useState, useCallback } from 'react';
import { Connection, Edge, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import { MindMapNode } from '../types';
import { createNewNode } from '../utils/mindMapUtils';
import { useToast } from "@/hooks/use-toast";

const initialNodes: MindMapNode[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Main Topic' },
    position: { x: 250, y: 0 },
    style: {
      background: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid hsl(var(--border))',
    },
  },
];

export const useMindMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [newNodeText, setNewNodeText] = useState("");
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (selectedColor: string, customColor: string) => {
    if (!newNodeText.trim()) return;
    
    const newNode = createNewNode(
      `${nodes.length + 1}`,
      newNodeText,
      {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      selectedColor === 'custom' ? customColor : selectedColor,
      selectedColor === 'custom'
    );
    
    setNodes((nds) => [...nds, newNode]);
    setNewNodeText("");
    
    toast({
      title: "Node added",
      description: "New mind map node has been created",
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

  return {
    nodes,
    edges,
    newNodeText,
    setNewNodeText,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    clearCanvas,
  };
};