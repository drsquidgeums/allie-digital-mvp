
import React, { useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  ConnectionLineType,
  useReactFlow,
} from '@xyflow/react';
import { MindMapNode } from './types';

interface MindMapFlowProps {
  nodes: MindMapNode[];
  edges: any[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  nodeTypes: any;
  onDeleteNode?: (nodeId: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
}

export const MindMapFlow: React.FC<MindMapFlowProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  nodeTypes,
  onDeleteNode,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onFitView,
}) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const selectedNodes = nodes.filter(node => node.selected);

    // Handle keyboard shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 'z':
          event.preventDefault();
          if (event.shiftKey) {
            onRedo?.();
          } else {
            onUndo?.();
          }
          break;
        case 'y':
          event.preventDefault();
          onRedo?.();
          break;
        case '=':
        case '+':
          event.preventDefault();
          zoomIn();
          onZoomIn?.();
          break;
        case '-':
          event.preventDefault();
          zoomOut();
          onZoomOut?.();
          break;
        case '0':
          event.preventDefault();
          fitView();
          onFitView?.();
          break;
      }
      return;
    }

    // Handle other keys
    switch (event.key) {
      case 'Delete':
      case 'Backspace':
        if (selectedNodes.length && onDeleteNode) {
          selectedNodes.forEach(node => onDeleteNode(node.id));
        }
        break;
      case 'Escape':
        onNodesChange(
          nodes.filter(node => node.selected).map(node => ({
            type: 'select',
            id: node.id,
            selected: false,
          }))
        );
        break;
    }
  }, [nodes, onNodesChange, onDeleteNode, onUndo, onRedo, onZoomIn, onZoomOut, onFitView, zoomIn, zoomOut, fitView]);

  return (
    <div 
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="application"
      aria-label="Mind map canvas - Use Ctrl+Z to undo, Ctrl+Y to redo, Ctrl+Plus to zoom in, Ctrl+Minus to zoom out"
      className="focus:outline-none focus:ring-1 focus:ring-primary/30 h-full"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
        className="bg-background"
        defaultEdgeOptions={{
          style: { 
            stroke: '#9b87f5', 
            strokeWidth: 2,
            strokeDasharray: 'none'
          },
          animated: true,
          deletable: true,
          type: 'step',
        }}
        connectionLineStyle={{
          stroke: '#9b87f5',
          strokeWidth: 2,
          strokeDasharray: '5,5',
        }}
        connectionLineType={ConnectionLineType.Step}
        snapToGrid={true}
        snapGrid={[10, 10]}
        proOptions={{ hideAttribution: true }}
        aria-label="Mind map flow diagram"
      >
        <Controls 
          className="bg-background/80 shadow-md backdrop-blur-sm border-none rounded-lg m-4 z-50" 
          aria-label="Mind map zoom and pan controls" 
          showInteractive={false}
          position="top-right"
        />
        <Background 
          gap={20} 
          size={1.5} 
          color="var(--border)" 
          className="bg-background"
        />
      </ReactFlow>
    </div>
  );
};
