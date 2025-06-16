
import { useState, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Connection, Edge, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import { MindMapNode, NodeStyle } from '../types';
import { initialNodes } from '../constants/nodeTypes';
import { useMindMapHistory } from './useMindMapHistory';
import { useAutoLayout, LayoutType } from './useAutoLayout';

export const useMindMapState = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<MindMapNode>(initialNodes as MindMapNode[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedColor, setSelectedColor] = useState('hsl(var(--muted))');
  const [customColor, setCustomColor] = useState("#FFFFFF");
  const [selectedTextColor, setSelectedTextColor] = useState('auto');
  const [customTextColor, setCustomTextColor] = useState("#000000");
  const [newNodeText, setNewNodeText] = useState("");
  const { toast } = useToast();

  const { saveState, undo, redo, canUndo, canRedo, clearHistoryFlag } = useMindMapHistory(
    initialNodes as MindMapNode[], 
    []
  );
  const { applyLayout } = useAutoLayout();

  // Save state to history when nodes or edges change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveState(nodes, edges);
      clearHistoryFlag();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [nodes, edges, saveState, clearHistoryFlag]);

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

    const newNode: MindMapNode = {
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
    setNodes(initialNodes as MindMapNode[]);
    setEdges([]);
    
    toast({
      title: "Canvas cleared",
      description: "Mind map has been reset to initial state",
    });
  }, [setNodes, setEdges, toast]);

  const handleUndo = useCallback(() => {
    const previousState = undo();
    if (previousState) {
      setNodes(previousState.nodes);
      setEdges(previousState.edges);
      toast({
        title: "Undone",
        description: "Last action has been undone",
      });
    }
  }, [undo, setNodes, setEdges, toast]);

  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState) {
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      toast({
        title: "Redone",
        description: "Action has been redone",
      });
    }
  }, [redo, setNodes, setEdges, toast]);

  const applyAutoLayout = useCallback((layoutType: LayoutType) => {
    const layoutNodes = applyLayout(nodes, edges, layoutType);
    setNodes(layoutNodes);
    
    toast({
      title: "Layout applied",
      description: `${layoutType} layout has been applied to the mind map`,
    });
  }, [nodes, edges, applyLayout, setNodes, toast]);

  const loadTemplate = useCallback((templateNodes: Omit<MindMapNode, 'id'>[]) => {
    const nodesWithIds = templateNodes.map((node, index) => ({
      ...node,
      id: `template_${Date.now()}_${index}`
    }));

    setNodes(nodesWithIds);
    setEdges([]);
    
    toast({
      title: "Template loaded",
      description: "Mind map template has been applied",
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
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    applyAutoLayout,
    loadTemplate,
  };
};
