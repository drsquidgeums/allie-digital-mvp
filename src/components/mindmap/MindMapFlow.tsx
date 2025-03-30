
import React, { useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useReactFlow,
} from '@xyflow/react';

interface MindMapFlowProps {
  nodes: any[];
  edges: any[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  nodeTypes: any;
}

export const MindMapFlow: React.FC<MindMapFlowProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  nodeTypes,
}) => {
  const { fitView } = useReactFlow();

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const selectedNodes = nodes.filter(node => node.selected);

    switch (event.key) {
      case 'Delete':
      case 'Backspace':
        if (selectedNodes.length) {
          onNodesChange(selectedNodes.map(node => ({
            type: 'remove',
            id: node.id,
          })));
        }
        break;
      case 'f':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          fitView({ duration: 200 });
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
  }, [nodes, onNodesChange, fitView]);

  return (
    <div 
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="application"
      aria-label="Mind map canvas"
      className="focus:outline-none focus:ring-2 focus:ring-ring h-full"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
        className="bg-background/80 dark:bg-background/95"
        defaultEdgeOptions={{
          style: { stroke: 'var(--border)', strokeWidth: 1.5 },
          animated: true,
        }}
        aria-label="Mind map flow diagram"
      >
        <Controls 
          className="bg-card shadow-md border border-border/40 rounded-lg m-4" 
          aria-label="Mind map controls" 
          showInteractive={false}
        />
        <Background 
          gap={24} 
          size={1.5} 
          color="var(--border)" 
          className="bg-background/80 dark:bg-background/95"
        />
      </ReactFlow>
    </div>
  );
};
