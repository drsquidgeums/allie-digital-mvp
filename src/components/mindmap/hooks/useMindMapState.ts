
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Connection, Edge, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import { Node, NodeStyle } from '../types';
import { initialNodes } from '../constants/nodeTypes';

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

    const textColor = selectedTextColor === 'custom' ? customTextColor : selectedTextColor;
    
    const nodeStyle: NodeStyle = {
      background: selectedColor === 'custom' ? customColor : selectedColor,
      color: textColor,
    };

    const newNode: Node = {
      id: `node_${Date.now()}`,
      type: 'default',
      data: { 
        label: newNodeText,
        textColor
      },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 300,
      },
      style: nodeStyle,
    };

    setNodes((nds) => [...nds, newNode]);
    setNewNodeText("");
    
    toast({
      title: "Node added",
      description: "New mind map node has been created",
    });
  }, [newNodeText, selectedColor, customColor, selectedTextColor, customTextColor, setNodes, toast]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    ));
    
    toast({
      title: "Node deleted",
      description: "Mind map node has been removed",
    });
  }, [setNodes, setEdges, toast]);

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
    deleteNode,
    clearCanvas,
  };
};
