import React from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
} from '@xyflow/react';

interface MindMapFlowProps {
  nodes: any[];
  edges: any[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
}

export const MindMapFlow: React.FC<MindMapFlowProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
}) => {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      className="dark:bg-background"
    >
      <Controls className="dark:bg-muted dark:border-muted-foreground/20" />
      <MiniMap className="dark:bg-muted" />
      <Background className="dark:bg-background" />
    </ReactFlow>
  );
};