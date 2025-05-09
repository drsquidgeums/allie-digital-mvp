
import React from 'react';
import { Circle, Square, Triangle, Hexagon, FileText } from 'lucide-react';
import { ShapeConfig } from '../types';

export const SHAPE_CONFIGS: Array<ShapeConfig> = [
  {
    id: 'circle',
    label: 'Circle',
    icon: Circle,
  },
  {
    id: 'rectangle',
    label: 'Rectangle',
    icon: Square,
  },
  {
    id: 'triangle',
    label: 'Triangle',
    icon: Triangle,
  },
  {
    id: 'document',
    label: 'Document',
    icon: FileText, // Replaced PenTool with FileText
  },
  {
    id: 'hexagon',
    label: 'Hexagon',
    icon: Hexagon,
  }
];
