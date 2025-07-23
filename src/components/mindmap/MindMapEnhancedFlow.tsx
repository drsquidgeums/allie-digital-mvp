
import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  ConnectionLineType,
  useReactFlow,
} from '@xyflow/react';
import { MindMapNode } from './types';
import { FloatingAddButton } from './toolbar/FloatingAddButton';
import { toast } from "sonner";

interface MindMapEnhancedFlowProps {
  nodes: MindMapNode[];
  edges: any[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  nodeTypes: any;
  onDeleteNode?: (nodeId: string) => void;
  onAddNode?: (type: string, label?: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
}

export const MindMapEnhancedFlow: React.FC<MindMapEnhancedFlowProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  nodeTypes,
  onDeleteNode,
  onAddNode,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onFitView,
}) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const [floatingButton, setFloatingButton] = useState<{
    visible: boolean;
    position: { x: number; y: number };
  }>({ visible: false, position: { x: 0, y: 0 } });

  const handleDoubleClick = useCallback((event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setFloatingButton({
      visible: true,
      position: { x, y }
    });
  }, []);

  const handleFloatingAddNode = useCallback((type: string, label?: string) => {
    if (onAddNode) {
      onAddNode(type, label);
      toast(`Added ${type} node`);
    }
  }, [onAddNode]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const selectedNodes = nodes.filter(node => node.selected);

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

    switch (event.key) {
      case 'Delete':
      case 'Backspace':
        if (selectedNodes.length && onDeleteNode) {
          selectedNodes.forEach(node => {
            onDeleteNode(node.id);
            toast(`Deleted node`);
          });
        }
        break;
      case 'Escape':
        setFloatingButton({ visible: false, position: { x: 0, y: 0 } });
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
    <div className="relative h-full">
      <div 
        onKeyDown={handleKeyDown}
        onDoubleClick={handleDoubleClick}
        tabIndex={0}
        className="focus:outline-none h-full"
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
        >
          <Controls 
            className="bg-background/80 shadow-md backdrop-blur-sm border-none rounded-lg m-4 z-40" 
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

      <FloatingAddButton
        onAddNode={handleFloatingAddNode}
        position={floatingButton.position}
        isVisible={floatingButton.visible}
        onClose={() => setFloatingButton({ visible: false, position: { x: 0, y: 0 } })}
      />
    </div>
  );
};
