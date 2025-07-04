
import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  ConnectionLineType,
  useReactFlow,
  SelectionMode,
  BackgroundVariant,
} from '@xyflow/react';
import { MindMapNode } from './types';
import { toast } from 'sonner';

interface EnhancedMindMapFlowProps {
  nodes: MindMapNode[];
  edges: any[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  nodeTypes: any;
  onDeleteNode?: (nodeId: string) => void;
  onDuplicateNode?: (nodeId: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
}

export const EnhancedMindMapFlow: React.FC<EnhancedMindMapFlowProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  nodeTypes,
  onDeleteNode,
  onDuplicateNode,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onFitView,
}) => {
  const { zoomIn, zoomOut, fitView, getNode } = useReactFlow();

  // Enhanced keyboard navigation
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
        case 'd':
          event.preventDefault();
          if (selectedNodes.length === 1) {
            onDuplicateNode?.(selectedNodes[0].id);
          }
          break;
        case 'a':
          event.preventDefault();
          // Select all nodes
          onNodesChange(
            nodes.map(node => ({
              type: 'select',
              id: node.id,
              selected: true,
            }))
          );
          toast.info('All nodes selected');
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
        // Deselect all nodes
        onNodesChange(
          nodes.filter(node => node.selected).map(node => ({
            type: 'select',
            id: node.id,
            selected: false,
          }))
        );
        toast.info('Selection cleared');
        break;
      case 'Tab':
        event.preventDefault();
        // Focus next/previous node
        const currentSelected = selectedNodes[0];
        if (currentSelected) {
          const currentIndex = nodes.findIndex(n => n.id === currentSelected.id);
          const nextIndex = event.shiftKey 
            ? (currentIndex - 1 + nodes.length) % nodes.length
            : (currentIndex + 1) % nodes.length;
          const nextNode = nodes[nextIndex];
          
          if (nextNode) {
            onNodesChange([
              { type: 'select', id: currentSelected.id, selected: false },
              { type: 'select', id: nextNode.id, selected: true }
            ]);
          }
        }
        break;
    }
  }, [nodes, onNodesChange, onDeleteNode, onDuplicateNode, onUndo, onRedo, onZoomIn, onZoomOut, onFitView, zoomIn, zoomOut, fitView]);

  // Handle custom events from nodes
  useEffect(() => {
    const handleNodeUpdate = (event: CustomEvent) => {
      const { id, updates } = event.detail;
      onNodesChange([{
        type: 'replace',
        id,
        item: {
          ...getNode(id),
          data: { ...getNode(id)?.data, ...updates }
        }
      }]);
    };

    const handleNodeAction = (event: CustomEvent) => {
      const { nodeId, action } = event.detail;
      
      switch (action) {
        case 'duplicate':
          onDuplicateNode?.(nodeId);
          break;
        case 'delete':
          onDeleteNode?.(nodeId);
          break;
        case 'changeColor':
          // This would trigger the color selector
          toast.info('Use the color selector in the toolbar to change colors');
          break;
      }
    };

    const handleAddShapeNode = (event: CustomEvent) => {
      const { shape, label } = event.detail;
      
      const newNode = {
        id: `${shape}_${Date.now()}`,
        type: 'enhancedShapeNode',
        data: { 
          label,
          shape,
          color: 'hsl(var(--primary))',
          textColor: 'hsl(var(--primary-foreground))'
        },
        position: { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 },
      };

      onNodesChange([{ type: 'add', item: newNode }]);
    };

    window.addEventListener('nodeUpdate', handleNodeUpdate as EventListener);
    window.addEventListener('nodeAction', handleNodeAction as EventListener);
    window.addEventListener('addShapeNode', handleAddShapeNode as EventListener);

    return () => {
      window.removeEventListener('nodeUpdate', handleNodeUpdate as EventListener);
      window.removeEventListener('nodeAction', handleNodeAction as EventListener);
      window.removeEventListener('addShapeNode', handleAddShapeNode as EventListener);
    };
  }, [onNodesChange, onDeleteNode, onDuplicateNode, getNode]);

  return (
    <div 
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="application"
      aria-label="Enhanced Mind Map Canvas - Use arrow keys to navigate, Ctrl+Z to undo, Delete to remove nodes"
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
            stroke: 'hsl(var(--primary))', 
            strokeWidth: 2,
            strokeDasharray: 'none'
          },
          animated: true,
          deletable: true,
          type: 'smoothstep',
        }}
        connectionLineStyle={{
          stroke: 'hsl(var(--primary))',
          strokeWidth: 2,
          strokeDasharray: '5,5',
        }}
        connectionLineType={ConnectionLineType.SmoothStep}
        snapToGrid={true}
        snapGrid={[15, 15]}
        proOptions={{ hideAttribution: true }}
        aria-label="Mind map flow diagram"
        panOnScroll={true}
        selectionOnDrag={true}
        panOnDrag={[1, 2]}
        selectionMode={SelectionMode.Partial}
      >
        <Controls 
          className="bg-background/90 shadow-lg backdrop-blur-sm border border-border rounded-lg m-4 z-50" 
          aria-label="Mind map zoom and pan controls" 
          showInteractive={true}
          position="top-right"
        />
        <Background 
          gap={20} 
          size={1} 
          color="hsl(var(--border))" 
          className="bg-background opacity-50"
          variant={BackgroundVariant.Dots}
        />
      </ReactFlow>
    </div>
  );
};
