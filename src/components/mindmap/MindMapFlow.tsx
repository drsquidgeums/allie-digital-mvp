import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useReactFlow,
  Node,
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
        className="bg-workspace dark:bg-background"
        aria-label="Mind map flow diagram"
      >
        <Controls 
          className="bg-workspace dark:bg-muted border-border dark:border-muted-foreground/20"
          aria-label="Mind map controls"
          showInteractive={false}
        />
        <Background className="bg-workspace dark:bg-background" />
      </ReactFlow>
    </div>
  );
};