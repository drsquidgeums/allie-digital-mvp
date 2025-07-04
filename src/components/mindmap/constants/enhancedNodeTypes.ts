import { ShapeNode } from '../nodes/ShapeNode';
import { EnhancedShapeNode } from '../nodes/EnhancedShapeNode';
import { ImageNode } from '../nodes/ImageNode';

// Enhanced node types with better functionality
export const enhancedNodeTypes = {
  default: ShapeNode,
  shapeNode: ShapeNode,
  enhancedShapeNode: EnhancedShapeNode,
  imageNode: ImageNode,
};

// Keep original node types for backward compatibility
export { nodeTypes } from './nodeTypes';
