
import React from 'react';
import { MindMapToolbar } from './MindMapToolbar';
import { MindMapFlow } from './MindMapFlow';
import { MindMapCreativeToolbar } from './MindMapCreativeToolbar';
import { MindMapContainerProps } from './types';
import { toast } from "sonner";
import { ReactFlowProvider } from '@xyflow/react';
import { getShapeStyle } from './utils/shapeUtils';

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
  selectedTextColor,
  setSelectedTextColor,
  customTextColor,
  setCustomTextColor,
  newNodeText,
  setNewNodeText,
  onAddNode,
  onExportJpg,
  onExportJson,
  onClear,
  colorOptions,
  textColorOptions,
  nodeTypes,
}) => {
  // Add deleteNode prop to hook up to useMindMapState's deleteNode function
  const handleDeleteNode = (nodeId: string) => {
    onNodesChange([{ type: 'remove', id: nodeId }]);
    toast(`Node deleted`);
  };

  const handleShapeSelect = (shape: string, label?: string) => {
    const nodeStyle = getShapeStyle(shape, selectedColor, customColor);

    const newNode = {
      id: `${shape}_${Date.now()}`,
      type: shape === 'image' ? 'imageNode' : 'shapeNode',
      data: { 
        label: label || '',
        shape,
        color: selectedColor === 'custom' ? customColor : selectedColor,
        textColor: selectedTextColor === 'custom' ? customTextColor : selectedTextColor
      },
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      style: nodeStyle,
    };

    onNodesChange([{ type: 'add', item: newNode }]);
    toast(`Added ${shape} node`);
  };

  return (
    <div 
      className="w-full h-[calc(100vh-12rem)] bg-background rounded-xl overflow-hidden flex flex-col shadow-lg animate-fade-in relative"
      role="application"
      aria-label="Mind map editor"
    >
      <MindMapToolbar
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        customColor={customColor}
        setCustomColor={setCustomColor}
        selectedTextColor={selectedTextColor}
        setSelectedTextColor={setSelectedTextColor}
        customTextColor={customTextColor}
        setCustomTextColor={setCustomTextColor}
        newNodeText={newNodeText}
        setNewNodeText={setNewNodeText}
        onAddNode={onAddNode}
        onExportJpg={onExportJpg}
        onExportJson={onExportJson}
        onClear={onClear}
        colorOptions={colorOptions}
        textColorOptions={textColorOptions}
      />
      <div className="flex-1 min-h-0 relative">
        <ReactFlowProvider>
          <MindMapFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onDeleteNode={handleDeleteNode}
          />
        </ReactFlowProvider>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <MindMapCreativeToolbar 
            onShapeSelect={handleShapeSelect}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            customColor={customColor}
            setCustomColor={setCustomColor}
            selectedTextColor={selectedTextColor}
            setSelectedTextColor={setSelectedTextColor}
            customTextColor={customTextColor}
            setCustomTextColor={setCustomTextColor}
          />
        </div>
      </div>
    </div>
  );
};
