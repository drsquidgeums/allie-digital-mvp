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
  onExportJpg: () => void;
  onExportJson: () => void;
  onClear: () => void;
  colorOptions: ColorOption[];
  nodeTypes: any;
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
  onExportJpg,
  onExportJson,
  onClear,
  colorOptions,
  nodeTypes,
}) => {
  const handleShapeSelect = (shape: string, label?: string) => {
    let nodeStyle: React.CSSProperties = {
      background: selectedColor === 'custom' ? customColor : selectedColor,
      border: '1px solid #ddd',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '10px',
    };

    // Apply specific styles based on shape
    switch (shape) {
      case 'circle':
        nodeStyle = {
          ...nodeStyle,
          borderRadius: '50%',
          width: 100,
          height: 100,
        };
        break;
      case 'triangle':
        nodeStyle = {
          ...nodeStyle,
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          width: 100,
          height: 100,
        };
        break;
      case 'diamond':
        nodeStyle = {
          ...nodeStyle,
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          width: 100,
          height: 100,
        };
        break;
      case 'hexagon':
        nodeStyle = {
          ...nodeStyle,
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          width: 120,
          height: 100,
        };
        break;
      case 'star':
        nodeStyle = {
          ...nodeStyle,
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          width: 100,
          height: 100,
        };
        break;
      case 'image':
        nodeStyle = {
          padding: 0,
          background: 'transparent',
          border: 'none',
        };
        break;
      default:
        nodeStyle = {
          ...nodeStyle,
          width: 150,
          height: 100,
          borderRadius: '4px',
        };
    }

    const newNode = {
      id: `${shape}_${Date.now()}`,
      type: shape === 'image' ? 'imageNode' : 'default',
      data: { label: label || shape },
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      style: nodeStyle,
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
        onExportJpg={onExportJpg}
        onExportJson={onExportJson}
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
          nodeTypes={nodeTypes}
        />
      </div>
      <div className="flex-shrink-0">
        <MindMapCreativeToolbar onShapeSelect={handleShapeSelect} />
      </div>
    </div>
  );
};