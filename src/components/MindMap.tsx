
import React from 'react';
import '@xyflow/react/dist/style.css';
import '../styles/mindmap.css';
import { EnhancedMindMapContainer } from './mindmap/EnhancedMindMapContainer';
import { useMindMapState } from './mindmap/hooks/useMindMapState';
import { downloadMindMapAsJpg, downloadMindMapAsJson } from './mindmap/utils/mindMapUtils';
import { colorOptions, textColorOptions } from './mindmap/constants/colors';
import { ReactFlowProvider } from '@xyflow/react';

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
    deleteNode,
    clearCanvas,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    applyAutoLayout,
    loadTemplate,
  } = useMindMapState();

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-hidden">
        <ReactFlowProvider>
          <EnhancedMindMapContainer
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
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={canUndo}
            canRedo={canRedo}
            onApplyLayout={applyAutoLayout}
            onLoadTemplate={loadTemplate}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
};
