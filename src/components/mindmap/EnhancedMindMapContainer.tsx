
import React, { useCallback } from 'react';
import { EnhancedMindMapToolbar } from './EnhancedMindMapToolbar';
import { EnhancedMindMapFlow } from './EnhancedMindMapFlow';
import { MindMapCreativeToolbar } from './MindMapCreativeToolbar';
import { MindMapContainerProps } from './types';
import { toast } from "sonner";
import { getShapeStyle } from './utils/shapeUtils';
import { useReactFlow } from '@xyflow/react';
import { enhancedNodeTypes } from './constants/enhancedNodeTypes';

interface EnhancedMindMapContainerProps extends MindMapContainerProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onApplyLayout: (layoutType: any) => void;
  onLoadTemplate: (templateNodes: any) => void;
}

export const EnhancedMindMapContainer: React.FC<EnhancedMindMapContainerProps> = ({
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
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onApplyLayout,
  onLoadTemplate,
}) => {
  const { zoomIn, zoomOut, fitView, getNode } = useReactFlow();

  const handleShapeSelect = useCallback((shape: string, label?: string) => {
    const nodeStyle = getShapeStyle(shape, selectedColor, customColor);

    const newNode = {
      id: `${shape}_${Date.now()}`,
      type: 'enhancedShapeNode',
      data: { 
        label: label || '',
        shape,
        color: selectedColor === 'custom' ? customColor : selectedColor,
        textColor: selectedTextColor === 'custom' ? customTextColor : selectedTextColor
      },
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      style: nodeStyle,
    };

    onNodesChange([{ type: 'add', item: newNode }]);
    toast.success(`Added ${shape} node`);
  }, [selectedColor, customColor, selectedTextColor, customTextColor, onNodesChange]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    onNodesChange([{ type: 'remove', id: nodeId }]);
    // Also remove connected edges
    const connectedEdges = edges.filter(edge => 
      edge.source === nodeId || edge.target === nodeId
    );
    if (connectedEdges.length > 0) {
      onEdgesChange(connectedEdges.map(edge => ({ type: 'remove', id: edge.id })));
    }
    toast.success('Node deleted');
  }, [edges, onNodesChange, onEdgesChange]);

  const handleDuplicateNode = useCallback((nodeId: string) => {
    const node = getNode(nodeId);
    if (node) {
      const duplicatedNode = {
        ...node,
        id: `${node.id}_copy_${Date.now()}`,
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50,
        },
        selected: false,
      };
      onNodesChange([{ type: 'add', item: duplicatedNode }]);
      toast.success('Node duplicated');
    }
  }, [getNode, onNodesChange]);

  const handleZoomIn = useCallback(() => {
    zoomIn();
    toast.success("Zoomed in");
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut();
    toast.success("Zoomed out");
  }, [zoomOut]);

  const handleFitView = useCallback(() => {
    fitView();
    toast.success("Fit to view");
  }, [fitView]);

  return (
    <div 
      className="w-full h-[calc(100vh-12rem)] bg-background rounded-xl overflow-hidden flex flex-col shadow-lg animate-fade-in relative"
      role="application"
      aria-label="Enhanced mind map editor with improved editing and node management"
    >
      <EnhancedMindMapToolbar
        newNodeText={newNodeText}
        setNewNodeText={setNewNodeText}
        onAddNode={onAddNode}
        onExportJpg={onExportJpg}
        onExportJson={onExportJson}
        onClear={onClear}
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onApplyLayout={onApplyLayout}
        onLoadTemplate={onLoadTemplate}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitView={handleFitView}
      />
      
      <div className="flex-1 min-h-0 relative">
        <EnhancedMindMapFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={enhancedNodeTypes}
          onDeleteNode={handleDeleteNode}
          onDuplicateNode={handleDuplicateNode}
          onUndo={onUndo}
          onRedo={onRedo}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitView={handleFitView}
        />
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
