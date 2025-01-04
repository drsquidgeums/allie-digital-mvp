import React, { useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
} from '@xyflow/react';
import { useToast } from "@/hooks/use-toast";
import { MindMapToolbar } from './mindmap/MindMapToolbar';
import { ColorOption } from './mindmap/types';
import { useMindMap } from './mindmap/hooks/useMindMap';
import { downloadMindMap } from './mindmap/utils/mindMapUtils';
import '@xyflow/react/dist/style.css';

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
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
  const [customColor, setCustomColor] = useState("#FFFFFF");
  const { toast } = useToast();
  
  const {
    nodes,
    edges,
    newNodeText,
    setNewNodeText,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    clearCanvas,
  } = useMindMap();

  const handleColorChange = (value: string) => {
    if (value === 'custom') {
      setSelectedColor(customColor);
    } else {
      setSelectedColor(value);
    }
  };

  const handleAddNode = () => {
    addNode(selectedColor, customColor);
  };

  const handleDownloadImage = () => {
    downloadMindMap(toast);
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
        onAddNode={handleAddNode}
        onExport={handleDownloadImage}
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