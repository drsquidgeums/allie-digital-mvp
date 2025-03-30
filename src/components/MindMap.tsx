
import React from 'react';
import '@xyflow/react/dist/style.css';
import '../styles/mindmap.css';
import { MindMapContainer } from './mindmap/MindMapContainer';
import { useMindMapState } from './mindmap/hooks/useMindMapState';
import { downloadMindMapAsJpg, downloadMindMapAsJson } from './mindmap/utils/mindMapUtils';
import { nodeTypes } from './mindmap/constants/nodeTypes';
import { colorOptions, textColorOptions } from './mindmap/constants/colors';

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
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-hidden">
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
      </div>
    </div>
  );
};
