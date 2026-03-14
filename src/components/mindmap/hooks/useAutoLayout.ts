
import { useCallback } from 'react';
import { MindMapNode } from '../types';
import { Edge } from '@xyflow/react';

export type LayoutType = 'radial' | 'hierarchical' | 'force' | 'horizontal' | 'vertical' | 'grid' | 'circular';

export const useAutoLayout = () => {
  const applyRadialLayout = useCallback((nodes: MindMapNode[], edges: Edge[]) => {
    const centerNode = nodes.find(node => node.id === '1') || nodes[0];
    if (!centerNode) return nodes;

    const connectedNodes = nodes.filter(node => node.id !== centerNode.id);
    const radius = 200;
    const angleStep = (2 * Math.PI) / Math.max(connectedNodes.length, 1);

    return nodes.map((node, index) => {
      if (node.id === centerNode.id) {
        return { ...node, position: { x: 400, y: 300 } };
      }

      const nodeIndex = connectedNodes.findIndex(n => n.id === node.id);
      const angle = nodeIndex * angleStep;
      const x = 400 + radius * Math.cos(angle);
      const y = 300 + radius * Math.sin(angle);

      return { ...node, position: { x, y } };
    });
  }, []);

  const applyHierarchicalLayout = useCallback((nodes: MindMapNode[], edges: Edge[]) => {
    const rootNode = nodes.find(node => node.id === '1') || nodes[0];
    if (!rootNode) return nodes;

    const levels: { [key: number]: MindMapNode[] } = { 0: [rootNode] };
    const visited = new Set([rootNode.id]);
    let currentLevel = 0;

    // Build hierarchy levels
    while (levels[currentLevel]?.length > 0) {
      levels[currentLevel + 1] = [];
      
      levels[currentLevel].forEach(parentNode => {
        const children = edges
          .filter(edge => edge.source === parentNode.id)
          .map(edge => nodes.find(node => node.id === edge.target))
          .filter((node): node is MindMapNode => node !== undefined && !visited.has(node.id));

        children.forEach(child => {
          levels[currentLevel + 1].push(child);
          visited.add(child.id);
        });
      });

      if (levels[currentLevel + 1].length === 0) {
        delete levels[currentLevel + 1];
        break;
      }
      currentLevel++;
    }

    // Position nodes
    return nodes.map(node => {
      const level = Object.keys(levels).find(l => 
        levels[parseInt(l)].some(n => n.id === node.id)
      );
      
      if (level === undefined) return node;

      const levelNum = parseInt(level);
      const nodesInLevel = levels[levelNum];
      const nodeIndex = nodesInLevel.findIndex(n => n.id === node.id);
      const spacing = 180;
      const levelHeight = 120;

      const x = 400 + (nodeIndex - (nodesInLevel.length - 1) / 2) * spacing;
      const y = 100 + levelNum * levelHeight;

      return { ...node, position: { x, y } };
    });
  }, []);

  const applyLayout = useCallback((
    nodes: MindMapNode[], 
    edges: Edge[], 
    layoutType: LayoutType
  ) => {
    switch (layoutType) {
      case 'radial':
        return applyRadialLayout(nodes, edges);
      case 'hierarchical':
        return applyHierarchicalLayout(nodes, edges);
      case 'force':
        return nodes.map((node, index) => ({
          ...node,
          position: {
            x: 200 + (index % 4) * 200,
            y: 200 + Math.floor(index / 4) * 150
          }
        }));
      case 'horizontal': {
        const root = nodes.find(n => n.id === '1') || nodes[0];
        if (!root) return nodes;
        const others = nodes.filter(n => n.id !== root.id);
        return nodes.map(node => {
          if (node.id === root.id) return { ...node, position: { x: 100, y: 300 } };
          const idx = others.findIndex(n => n.id === node.id);
          const level = Math.floor(idx / 3) + 1;
          const row = idx % 3;
          return { ...node, position: { x: 100 + level * 220, y: 150 + row * 140 } };
        });
      }
      case 'vertical': {
        const root = nodes.find(n => n.id === '1') || nodes[0];
        if (!root) return nodes;
        const others = nodes.filter(n => n.id !== root.id);
        return nodes.map(node => {
          if (node.id === root.id) return { ...node, position: { x: 400, y: 50 } };
          const idx = others.findIndex(n => n.id === node.id);
          const col = idx % 3;
          const row = Math.floor(idx / 3) + 1;
          return { ...node, position: { x: 200 + col * 200, y: 50 + row * 140 } };
        });
      }
      case 'grid': {
        const cols = Math.ceil(Math.sqrt(nodes.length));
        return nodes.map((node, index) => ({
          ...node,
          position: {
            x: 100 + (index % cols) * 200,
            y: 100 + Math.floor(index / cols) * 160
          }
        }));
      }
      case 'circular': {
        const cx = 400, cy = 300;
        const r = Math.max(150, nodes.length * 30);
        return nodes.map((node, index) => {
          const angle = (2 * Math.PI * index) / nodes.length;
          return { ...node, position: { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) } };
        });
      }
      default:
        return nodes;
    }
  }, [applyRadialLayout, applyHierarchicalLayout]);

  return { applyLayout };
};
