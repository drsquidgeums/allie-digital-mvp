
import React from 'react';
import '@xyflow/react/dist/style.css';
import { MindMapContainer } from './mindmap/MindMapContainer';
import { ColorOption } from './mindmap/types';
import { ImageNode } from './mindmap/nodes/ImageNode';
import { ShapeNode } from './mindmap/nodes/ShapeNode';
import { useMindMapState } from './mindmap/hooks/useMindMapState';
import { downloadMindMapAsJpg, downloadMindMapAsJson } from './mindmap/utils/mindMapUtils';

const nodeTypes = {
  imageNode: ImageNode,
  shapeNode: ShapeNode,
};

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

const textColorOptions: ColorOption[] = [
  { label: 'Auto', value: 'auto' },
  { label: 'Black', value: '#000000' },
  { label: 'White', value: '#FFFFFF' },
  { label: 'Gray', value: '#666666' },
  { label: 'Custom', value: 'custom' },
];

export const MindMap = () => {
  const {
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
  } = useMindMapState();

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
      selectedTextColor={selectedTextColor}
      setSelectedTextColor={setSelectedTextColor}
      customTextColor={customTextColor}
      setCustomTextColor={setCustomTextColor}
      newNodeText={newNodeText}
      setNewNodeText={setNewNodeText}
      onAddNode={addNode}
      onExportJpg={() => downloadMindMapAsJpg()}
      onExportJson={() => downloadMindMapAsJson(nodes, edges)}
      onClear={clearCanvas}
      colorOptions={colorOptions}
      textColorOptions={textColorOptions}
      nodeTypes={nodeTypes}
    />
  );
};
