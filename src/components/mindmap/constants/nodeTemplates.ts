
import { MindMapNode } from '../types';

export interface NodeTemplate {
  id: string;
  name: string;
  description: string;
  nodes: Omit<MindMapNode, 'id'>[];
  category: 'planning' | 'analysis' | 'creative' | 'business';
}

export const NODE_TEMPLATES: NodeTemplate[] = [
  {
    id: 'swot',
    name: 'SWOT Analysis',
    description: 'Strengths, Weaknesses, Opportunities, Threats',
    category: 'analysis',
    nodes: [
      {
        type: 'default',
        data: { label: 'SWOT Analysis', textColor: '#000000' },
        position: { x: 400, y: 200 },
        style: { background: '#f0f9ff', color: '#000000' }
      },
      {
        type: 'default',
        data: { label: 'Strengths', textColor: '#000000' },
        position: { x: 200, y: 100 },
        style: { background: '#dcfce7', color: '#000000' }
      },
      {
        type: 'default',
        data: { label: 'Weaknesses', textColor: '#000000' },
        position: { x: 600, y: 100 },
        style: { background: '#fef2f2', color: '#000000' }
      },
      {
        type: 'default',
        data: { label: 'Opportunities', textColor: '#000000' },
        position: { x: 200, y: 300 },
        style: { background: '#fffbeb', color: '#000000' }
      },
      {
        type: 'default',
        data: { label: 'Threats', textColor: '#000000' },
        position: { x: 600, y: 300 },
        style: { background: '#fdf2f8', color: '#000000' }
      }
    ]
  },
  {
    id: 'project-planning',
    name: 'Project Planning',
    description: 'Project phases and deliverables',
    category: 'planning',
    nodes: [
      {
        type: 'default',
        data: { label: 'Project Name', textColor: '#000000' },
        position: { x: 400, y: 150 },
        style: { background: '#e0e7ff', color: '#000000' }
      },
      {
        type: 'default',
        data: { label: 'Planning', textColor: '#000000' },
        position: { x: 200, y: 250 },
        style: { background: '#ddd6fe', color: '#000000' }
      },
      {
        type: 'default',
        data: { label: 'Execution', textColor: '#000000' },
        position: { x: 400, y: 250 },
        style: { background: '#fce7f3', color: '#000000' }
      },
      {
        type: 'default',
        data: { label: 'Review', textColor: '#000000' },
        position: { x: 600, y: 250 },
        style: { background: '#ecfdf5', color: '#000000' }
      }
    ]
  },
  {
    id: 'brainstorm',
    name: 'Brainstorming',
    description: 'Central idea with branching thoughts',
    category: 'creative',
    nodes: [
      {
        type: 'default',
        data: { label: 'Main Idea', textColor: '#000000' },
        position: { x: 400, y: 200 },
        style: { background: '#fef3c7', color: '#000000' }
      },
      {
        type: 'default',
        data: { label: 'Idea 1', textColor: '#000000' },
        position: { x: 250, y: 120 },
        style: { background: '#e0f2fe', color: '#000000' }
      },
      {
        type: 'default',
        data: { label: 'Idea 2', textColor: '#000000' },
        position: { x: 550, y: 120 },
        style: { background: '#f0fdf4', color: '#000000' }
      },
      {
        type: 'default',
        data: { label: 'Idea 3', textColor: '#000000' },
        position: { x: 250, y: 280 },
        style: { background: '#fef7ed', color: '#000000' }
      },
      {
        type: 'default',
        data: { label: 'Idea 4', textColor: '#000000' },
        position: { x: 550, y: 280 },
        style: { background: '#fdf4ff', color: '#000000' }
      }
    ]
  }
];
