import React, { useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { addEdge, Connection, Edge, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MindMapContainer } from './mindmap/MindMapContainer';
import { ColorOption, Node } from './mindmap/types';

const colorOptions: ColorOption[] = [
  { label: 'Default', value: 'hsl(var(--muted))' },
  { label: 'Purple', value: '#E5DEFF' },
  { label: 'Green', value: '#F2FCE2' },
  { label: 'Yellow', value: '#FEF7CD' },
  { label: 'Orange', value: '#FEC6A1' },
  { label: 'Pink', value: '#FFDEE2' },
  { label: 'Blue', value: '#D3E4FD' },
  { label: 'Custom', value: 'custom' },
];

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Main Topic' },
    position: { x: 250, y: 25 },
    style: {
      background: 'hsl(var(--muted))',
      color: 'hsl(var(--muted-foreground))',
    },
  },
];

export const MindMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedColor, setSelectedColor] = React.useState(colorOptions[0].value);
  const [customColor, setCustomColor] = React.useState("#FFFFFF");
  const [newNodeText, setNewNodeText] = React.useState("");
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = () => {
    if (!newNodeText.trim()) return;

    const newNode: Node = {
      id: `node_${Date.now()}`,
      type: 'default',
      data: { label: newNodeText },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 300,
      },
      style: {
        background: selectedColor === 'custom' ? customColor : selectedColor,
        color: 'hsl(var(--muted-foreground))',
      },
    };

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

  const downloadMindMap = () => {
    const data = {
      nodes,
      edges,
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "mindmap.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Download started",
      description: "Your mind map is being downloaded",
    });
  };

  return (
    <MindMapContainer
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      selectedColor={selectedColor}
      setSelectedColor={setSelectedColor}
      customColor={customColor}
      setCustomColor={setCustomColor}
      newNodeText={newNodeText}
      setNewNodeText={setNewNodeText}
      onAddNode={addNode}
      onExport={downloadMindMap}
      onClear={clearCanvas}
      colorOptions={colorOptions}
    />
  );
};