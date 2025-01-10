import React, { useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
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
    switch (event.key) {
      case 'Delete':
      case 'Backspace':
        const selectedNodes = nodes.filter(node => node.selected);
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
          fitView();
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
        break;
      case 'Tab':
        // Handle tab navigation between nodes
        event.preventDefault();
        const currentNode = nodes.find(node => node.selected);
        const nodeIndex = currentNode ? nodes.indexOf(currentNode) : -1;
        const nextIndex = event.shiftKey 
          ? (nodeIndex - 1 + nodes.length) % nodes.length 
          : (nodeIndex + 1) % nodes.length;
        
        onNodesChange([
          ...(currentNode ? [{
            type: 'select',
            id: currentNode.id,
            selected: false,
          }] : []),
          {
            type: 'select',
            id: nodes[nextIndex].id,
            selected: true,
          },
        ]);
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
        nodeTypes={nodeTypes}
        fitView
        className="dark:bg-background"
      >
        <Controls 
          className="dark:bg-muted dark:border-muted-foreground/20"
          aria-label="Mind map controls"
        />
        <MiniMap 
          className="dark:bg-muted"
          aria-label="Mind map overview"
        />
        <Background className="dark:bg-background" />
      </ReactFlow>
    </div>
  );
};