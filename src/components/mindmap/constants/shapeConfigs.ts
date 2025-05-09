
import React from 'react';
import { Circle, Square, Triangle, Hexagon, FileText, Plus, Move, Pencil } from 'lucide-react';
import { ShapeConfig, ShapeConfigGroups } from '../types';

// Define individual shape configurations
const SHAPE_LIST: Array<ShapeConfig> = [
  {
    id: 'circle',
    label: 'Circle',
    icon: Circle,
    description: 'Add a circle node'
  },
  {
    id: 'rectangle',
    label: 'Rectangle',
    icon: Square,
    description: 'Add a rectangle node'
  },
  {
    id: 'triangle',
    label: 'Triangle',
    icon: Triangle,
    description: 'Add a triangle node'
  },
  {
    id: 'document',
    label: 'Document',
    icon: FileText,
    description: 'Add a document node'
  },
  {
    id: 'hexagon',
    label: 'Hexagon',
    icon: Hexagon,
    description: 'Add a hexagon node'
  }
];

// Define tool configurations
const TOOL_LIST: Array<ShapeConfig> = [
  {
    id: 'add',
    label: 'Add Node',
    icon: Plus,
    description: 'Add a new node'
  },
  {
    id: 'move',
    label: 'Move',
    icon: Move,
    description: 'Move nodes'
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: Pencil,
    description: 'Edit node content'
  }
];

// Export the shape configurations as a structured object with shapes and tools
export const SHAPE_CONFIGS: ShapeConfigGroups = {
  shapes: SHAPE_LIST,
  tools: TOOL_LIST
};
