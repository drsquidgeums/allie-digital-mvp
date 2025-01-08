import React from 'react';
import { MindMapToolbar } from './MindMapToolbar';
import { MindMapFlow } from './MindMapFlow';
import { MindMapCreativeToolbar } from './MindMapCreativeToolbar';
import { ColorOption } from './types';
import { toast } from "sonner";

interface MindMapContainerProps {
  nodes: any[];
  edges: any[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  newNodeText: string;
  setNewNodeText: (text: string) => void;
  onAddNode: () => void;
  onExport: () => void;
  onClear: () => void;
  colorOptions: ColorOption[];
}

export const MindMapContainer: React.FC<MindMapContainerProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  selectedColor,
  setSelectedColor,
  customColor,
  setCustomColor,
  newNodeText,
  setNewNodeText,
  onAddNode,
  onExport,
  onClear,
  colorOptions,
}) => {
  const handleShapeSelect = (shape: string, label?: string) => {
    const newNode = {
      id: `${shape}_${Date.now()}`,
      type: shape,
      data: { label: label || shape },
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      style: {
        background: selectedColor === 'custom' ? customColor : selectedColor,
        borderRadius: shape === 'circle' ? '50%' : 
                     shape === 'star' ? '0' : '4px',
        width: 150,
        height: shape === 'circle' ? 150 : 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #ddd',
      },
    };

    onNodesChange([{ type: 'add', item: newNode }]);
    toast(`Added ${shape} node`);
  };

  return (
    <div className="w-full h-[600px] bg-background border-none rounded-lg overflow-hidden flex flex-col">
      <MindMapToolbar
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        customColor={customColor}
        setCustomColor={setCustomColor}
        newNodeText={newNodeText}
        setNewNodeText={setNewNodeText}
        onAddNode={onAddNode}
        onExport={onExport}
        onClear={onClear}
        colorOptions={colorOptions}
      />
      <div className="flex-1 min-h-0">
        <MindMapFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        />
      </div>
      <div className="flex-shrink-0">
        <MindMapCreativeToolbar onShapeSelect={handleShapeSelect} />
      </div>
    </div>
  );
};