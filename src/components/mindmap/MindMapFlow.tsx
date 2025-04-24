
import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useReactFlow,
  ConnectionLineType
} from '@xyflow/react';
import { MindMapNode } from './types';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';

interface MindMapFlowProps {
  nodes: MindMapNode[];
  edges: any[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  nodeTypes: any;
  onDeleteNode?: (nodeId: string) => void;
}

export const MindMapFlow = React.memo<MindMapFlowProps>(({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  nodeTypes,
  onDeleteNode,
}) => {
  usePerformanceMonitor('MindMapFlow');
  const { fitView } = useReactFlow();

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const selectedNodes = nodes.filter(node => node.selected);

    switch (event.key) {
      case 'Delete':
      case 'Backspace':
        if (selectedNodes.length && onDeleteNode) {
          selectedNodes.forEach(node => onDeleteNode(node.id));
        }
        break;
      case 'f':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          fitView({ duration: 400, padding: 0.2 });
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
  }, [nodes, onNodesChange, fitView, onDeleteNode]);

  const defaultEdgeOptions = useMemo(() => ({
    style: { 
      stroke: '#9b87f5', 
      strokeWidth: 2,
      strokeDasharray: 'none'
    },
    animated: true,
    deletable: true,
    type: 'step',
  }), []);

  const connectionLineStyle = useMemo(() => ({
    stroke: '#9b87f5',
    strokeWidth: 2,
    strokeDasharray: '5,5',
  }), []);

  return (
    <div 
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="application"
      aria-label="Mind map canvas"
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
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineStyle={connectionLineStyle}
        connectionLineType={ConnectionLineType.Step}
        snapToGrid={true}
        snapGrid={[10, 10]}
        proOptions={{ hideAttribution: true }}
        aria-label="Mind map flow diagram"
      >
        <Controls 
          className="bg-background/80 shadow-md backdrop-blur-sm border-none rounded-lg m-4 z-50" 
          aria-label="Mind map controls" 
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
});

MindMapFlow.displayName = 'MindMapFlow';
