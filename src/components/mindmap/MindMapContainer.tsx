
import React from 'react';
import { UnifiedMindMapToolbar } from './UnifiedMindMapToolbar';
import { MindMapEnhancedFlow } from './MindMapEnhancedFlow';
import { MindMapContainerProps } from './types';
import { toast } from "sonner";
import { getShapeStyle } from './utils/shapeUtils';
import { useReactFlow } from '@xyflow/react';

interface ExtendedMindMapContainerProps extends MindMapContainerProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onApplyLayout: (layoutType: any) => void;
  onLoadTemplate: (templateNodes: any) => void;
}

export const MindMapContainer: React.FC<ExtendedMindMapContainerProps> = ({
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
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onApplyLayout,
  onLoadTemplate,
  onAIGenerate,
  onAIExpand,
  isGenerating,
  isExpanding,
}) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

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

  const handleAddNode = (type: string, label?: string) => {
    const nodeStyle = getShapeStyle(type, selectedColor, customColor);

    const newNode = {
      id: `${type}_${Date.now()}`,
      type: type === 'image' ? 'imageNode' : 'shapeNode',
      data: { 
        label: label || 'New Node',
        shape: type,
        color: selectedColor === 'custom' ? customColor : selectedColor,
        textColor: selectedTextColor === 'custom' ? customTextColor : selectedTextColor
      },
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      style: nodeStyle,
    };

    onNodesChange([{ type: 'add', item: newNode }]);
  };

  const handleDeleteNode = (nodeId: string) => {
    onNodesChange([{ type: 'remove', id: nodeId }]);
  };

  const handleZoomIn = () => {
    zoomIn();
    toast("Zoomed in");
  };

  const handleZoomOut = () => {
    zoomOut();
    toast("Zoomed out");
  };

  const handleFitView = () => {
    fitView();
    toast("Fit to view");
  };

  return (
    <div className="w-full h-[calc(100vh-12rem)] bg-background rounded-xl overflow-hidden flex flex-col shadow-lg animate-fade-in">
      <div className="h-16 border-b border-border/30 bg-background/95 backdrop-blur-sm flex-shrink-0 pt-2">
        <UnifiedMindMapToolbar
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
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          customColor={customColor}
          setCustomColor={setCustomColor}
          selectedTextColor={selectedTextColor}
          setSelectedTextColor={setSelectedTextColor}
          customTextColor={customTextColor}
          setCustomTextColor={setCustomTextColor}
          onShapeSelect={handleShapeSelect}
          onAIGenerate={onAIGenerate}
          onAIExpand={onAIExpand}
          isGenerating={isGenerating}
          isExpanding={isExpanding}
          nodes={nodes}
        />
      </div>
      <div className="flex-1 min-h-0">
        <MindMapEnhancedFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDeleteNode={handleDeleteNode}
          onAddNode={handleAddNode}
          onUndo={onUndo}
          onRedo={onRedo}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitView={handleFitView}
        />
      </div>
    </div>
  );
};
