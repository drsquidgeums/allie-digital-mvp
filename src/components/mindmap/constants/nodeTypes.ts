
import { ImageNode } from '../nodes/ImageNode';
import { ShapeNode } from '../nodes/ShapeNode';
import { MindMapNode } from '../types';

export const nodeTypes = {
  imageNode: ImageNode,
  shapeNode: ShapeNode,
};

export const initialNodes: MindMapNode[] = [
  {
    id: '1',
    type: 'input',
    data: { 
      label: 'Main Topic',
      textColor: '#000000'
    },
    position: { x: 250, y: 25 },
    style: {
      background: 'hsl(var(--muted))',
      color: 'hsl(var(--muted-foreground))',
    },
  },
];
