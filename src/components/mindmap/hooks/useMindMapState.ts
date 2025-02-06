
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Connection, Edge, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import { Node } from '../types';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { 
      label: 'Main Topic',
      textColor: '#000000'
    },
    position: { x: 250, y: 25 },
    style: {
      background: 'hsl(var(--muted))',
      color: 'hsl(var(--muted-foreground))',
    },
  },
];

export const useMindMapState = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedColor, setSelectedColor] = useState('hsl(var(--muted))');
  const [customColor, setCustomColor] = useState("#FFFFFF");
  const [selectedTextColor, setSelectedTextColor] = useState('auto');
  const [customTextColor, setCustomTextColor] = useState("#000000");
  const [newNodeText, setNewNodeText] = useState("");
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = useCallback(() => {
    if (!newNodeText.trim()) return;

    const newNode: Node = {
      id: `node_${Date.now()}`,
      type: 'default',
      data: { 
        label: newNodeText,
        textColor: selectedTextColor === 'custom' ? customTextColor : selectedTextColor
      },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 300,
      },
      style: {
        background: selectedColor === 'custom' ? customColor : selectedColor,
        color: selectedTextColor === 'custom' ? customTextColor : selectedTextColor,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNewNodeText("");
    
    toast({
      title: "Node added",
      description: "New mind map node has been created",
    });
  }, [newNodeText, selectedColor, customColor, selectedTextColor, customTextColor, setNodes, toast]);

  const clearCanvas = useCallback(() => {
    setNodes(initialNodes);
    setEdges([]);
    
    toast({
      title: "Canvas cleared",
      description: "Mind map has been reset to initial state",
    });
  }, [setNodes, setEdges, toast]);

  return {
    nodes,
    edges,
    selectedColor,
    setSelectedColor,
    customColor,
    setCustomColor,
    selectedTextColor,
    setSelectedTextColor,
    customTextColor,
    setCustomTextColor,
    newNodeText,
    setNewNodeText,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    clearCanvas,
  };
};
