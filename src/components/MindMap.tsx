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
  Panel,
  useReactFlow,
} from '@xyflow/react';
import { useToast } from "@/hooks/use-toast";
import { MindMapToolbar } from './mindmap/MindMapToolbar';
import { ColorOption, MindMapNode } from './mindmap/types';
import { toPng } from 'html-to-image';
import '@xyflow/react/dist/style.css';

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

export const MindMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [newNodeText, setNewNodeText] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
  const [customColor, setCustomColor] = useState("#FFFFFF");
  const { toast } = useToast();
  const { getNodes } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleColorChange = (value: string) => {
    if (value === 'custom') {
      setSelectedColor(customColor);
    } else {
      setSelectedColor(value);
    }
  };

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
        background: selectedColor === 'custom' ? customColor : selectedColor,
        color: selectedColor === 'hsl(var(--muted))' ? 'hsl(var(--foreground))' : '#000000',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid hsl(var(--border))',
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    setNewNodeText("");
    
    toast({
      title: "Node added",
      description: "New mind map node has been created",
    });
  };

  const downloadImage = () => {
    const element = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!element) return;

    const { width, height } = element.getBoundingClientRect();
    
    toPng(element, {
      backgroundColor: '#fff',
      width,
      height,
      style: {
        transform: element.style.transform,
      },
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'mindmap.jpg';
        link.click();
        
        toast({
          title: "Mind map downloaded",
          description: "Your mind map has been saved as JPG",
        });
      })
      .catch((error) => {
        console.error('Error downloading image:', error);
        toast({
          title: "Download failed",
          description: "Failed to download mind map as JPG",
          variant: "destructive",
        });
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
      <MindMapToolbar
        selectedColor={selectedColor}
        setSelectedColor={handleColorChange}
        customColor={customColor}
        setCustomColor={setCustomColor}
        newNodeText={newNodeText}
        setNewNodeText={setNewNodeText}
        onAddNode={addNode}
        onExport={downloadImage}
        onClear={clearCanvas}
        colorOptions={colorOptions}
      />
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
        <Controls 
          className="!bg-accent [&>button]:!bg-accent [&>button]:!text-foreground [&>button]:hover:!bg-muted [&>button]:border-border" 
        />
        <MiniMap className="bg-background" />
      </ReactFlow>
    </div>
  );
};