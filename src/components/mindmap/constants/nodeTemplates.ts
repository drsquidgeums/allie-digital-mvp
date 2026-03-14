
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
      { type: 'default', data: { label: 'SWOT Analysis', textColor: '#000000' }, position: { x: 400, y: 200 }, style: { background: '#f0f9ff', color: '#000000' } },
      { type: 'default', data: { label: 'Strengths', textColor: '#000000' }, position: { x: 200, y: 100 }, style: { background: '#dcfce7', color: '#000000' } },
      { type: 'default', data: { label: 'Weaknesses', textColor: '#000000' }, position: { x: 600, y: 100 }, style: { background: '#fef2f2', color: '#000000' } },
      { type: 'default', data: { label: 'Opportunities', textColor: '#000000' }, position: { x: 200, y: 300 }, style: { background: '#fffbeb', color: '#000000' } },
      { type: 'default', data: { label: 'Threats', textColor: '#000000' }, position: { x: 600, y: 300 }, style: { background: '#fdf2f8', color: '#000000' } },
    ]
  },
  {
    id: 'pros-cons',
    name: 'Pros & Cons',
    description: 'Weigh advantages vs disadvantages',
    category: 'analysis',
    nodes: [
      { type: 'default', data: { label: 'Decision', textColor: '#000000' }, position: { x: 400, y: 80 }, style: { background: '#e0e7ff', color: '#000000' } },
      { type: 'default', data: { label: 'Pros', textColor: '#000000' }, position: { x: 200, y: 200 }, style: { background: '#dcfce7', color: '#000000' } },
      { type: 'default', data: { label: 'Pro 1', textColor: '#000000' }, position: { x: 100, y: 320 }, style: { background: '#f0fdf4', color: '#000000' } },
      { type: 'default', data: { label: 'Pro 2', textColor: '#000000' }, position: { x: 300, y: 320 }, style: { background: '#f0fdf4', color: '#000000' } },
      { type: 'default', data: { label: 'Cons', textColor: '#000000' }, position: { x: 600, y: 200 }, style: { background: '#fef2f2', color: '#000000' } },
      { type: 'default', data: { label: 'Con 1', textColor: '#000000' }, position: { x: 500, y: 320 }, style: { background: '#fff5f5', color: '#000000' } },
      { type: 'default', data: { label: 'Con 2', textColor: '#000000' }, position: { x: 700, y: 320 }, style: { background: '#fff5f5', color: '#000000' } },
    ]
  },
  {
    id: 'five-whys',
    name: '5 Whys',
    description: 'Root cause analysis technique',
    category: 'analysis',
    nodes: [
      { type: 'default', data: { label: 'Problem', textColor: '#000000' }, position: { x: 400, y: 50 }, style: { background: '#fef2f2', color: '#000000' } },
      { type: 'default', data: { label: 'Why? (1st)', textColor: '#000000' }, position: { x: 400, y: 150 }, style: { background: '#fff7ed', color: '#000000' } },
      { type: 'default', data: { label: 'Why? (2nd)', textColor: '#000000' }, position: { x: 400, y: 250 }, style: { background: '#fffbeb', color: '#000000' } },
      { type: 'default', data: { label: 'Why? (3rd)', textColor: '#000000' }, position: { x: 400, y: 350 }, style: { background: '#f0fdf4', color: '#000000' } },
      { type: 'default', data: { label: 'Why? (4th)', textColor: '#000000' }, position: { x: 400, y: 450 }, style: { background: '#e0f2fe', color: '#000000' } },
      { type: 'default', data: { label: 'Root Cause', textColor: '#000000' }, position: { x: 400, y: 550 }, style: { background: '#e0e7ff', color: '#000000' } },
    ]
  },
  {
    id: 'project-planning',
    name: 'Project Planning',
    description: 'Project phases and deliverables',
    category: 'planning',
    nodes: [
      { type: 'default', data: { label: 'Project Name', textColor: '#000000' }, position: { x: 400, y: 150 }, style: { background: '#e0e7ff', color: '#000000' } },
      { type: 'default', data: { label: 'Planning', textColor: '#000000' }, position: { x: 200, y: 250 }, style: { background: '#ddd6fe', color: '#000000' } },
      { type: 'default', data: { label: 'Execution', textColor: '#000000' }, position: { x: 400, y: 250 }, style: { background: '#fce7f3', color: '#000000' } },
      { type: 'default', data: { label: 'Review', textColor: '#000000' }, position: { x: 600, y: 250 }, style: { background: '#ecfdf5', color: '#000000' } },
    ]
  },
  {
    id: 'timeline',
    name: 'Timeline',
    description: 'Sequential events or milestones',
    category: 'planning',
    nodes: [
      { type: 'default', data: { label: 'Timeline', textColor: '#000000' }, position: { x: 400, y: 50 }, style: { background: '#e0e7ff', color: '#000000' } },
      { type: 'default', data: { label: 'Phase 1', textColor: '#000000' }, position: { x: 100, y: 180 }, style: { background: '#dbeafe', color: '#000000' } },
      { type: 'default', data: { label: 'Phase 2', textColor: '#000000' }, position: { x: 280, y: 180 }, style: { background: '#e0f2fe', color: '#000000' } },
      { type: 'default', data: { label: 'Phase 3', textColor: '#000000' }, position: { x: 460, y: 180 }, style: { background: '#cffafe', color: '#000000' } },
      { type: 'default', data: { label: 'Phase 4', textColor: '#000000' }, position: { x: 640, y: 180 }, style: { background: '#dcfce7', color: '#000000' } },
      { type: 'default', data: { label: 'Completion', textColor: '#000000' }, position: { x: 400, y: 300 }, style: { background: '#f0fdf4', color: '#000000' } },
    ]
  },
  {
    id: 'weekly-plan',
    name: 'Weekly Plan',
    description: 'Organise tasks by day of the week',
    category: 'planning',
    nodes: [
      { type: 'default', data: { label: 'Weekly Plan', textColor: '#000000' }, position: { x: 350, y: 50 }, style: { background: '#e0e7ff', color: '#000000' } },
      { type: 'default', data: { label: 'Monday', textColor: '#000000' }, position: { x: 50, y: 180 }, style: { background: '#fef3c7', color: '#000000' } },
      { type: 'default', data: { label: 'Tuesday', textColor: '#000000' }, position: { x: 200, y: 180 }, style: { background: '#fce7f3', color: '#000000' } },
      { type: 'default', data: { label: 'Wednesday', textColor: '#000000' }, position: { x: 350, y: 180 }, style: { background: '#dbeafe', color: '#000000' } },
      { type: 'default', data: { label: 'Thursday', textColor: '#000000' }, position: { x: 500, y: 180 }, style: { background: '#dcfce7', color: '#000000' } },
      { type: 'default', data: { label: 'Friday', textColor: '#000000' }, position: { x: 650, y: 180 }, style: { background: '#ede9fe', color: '#000000' } },
    ]
  },
  {
    id: 'brainstorm',
    name: 'Brainstorming',
    description: 'Central idea with branching thoughts',
    category: 'creative',
    nodes: [
      { type: 'default', data: { label: 'Main Idea', textColor: '#000000' }, position: { x: 400, y: 200 }, style: { background: '#fef3c7', color: '#000000' } },
      { type: 'default', data: { label: 'Idea 1', textColor: '#000000' }, position: { x: 250, y: 120 }, style: { background: '#e0f2fe', color: '#000000' } },
      { type: 'default', data: { label: 'Idea 2', textColor: '#000000' }, position: { x: 550, y: 120 }, style: { background: '#f0fdf4', color: '#000000' } },
      { type: 'default', data: { label: 'Idea 3', textColor: '#000000' }, position: { x: 250, y: 280 }, style: { background: '#fef7ed', color: '#000000' } },
      { type: 'default', data: { label: 'Idea 4', textColor: '#000000' }, position: { x: 550, y: 280 }, style: { background: '#fdf4ff', color: '#000000' } },
    ]
  },
  {
    id: 'decision-tree',
    name: 'Decision Tree',
    description: 'Map out choices and outcomes',
    category: 'creative',
    nodes: [
      { type: 'default', data: { label: 'Decision', textColor: '#000000' }, position: { x: 400, y: 50 }, style: { background: '#e0e7ff', color: '#000000' } },
      { type: 'default', data: { label: 'Option A', textColor: '#000000' }, position: { x: 200, y: 170 }, style: { background: '#dbeafe', color: '#000000' } },
      { type: 'default', data: { label: 'Option B', textColor: '#000000' }, position: { x: 600, y: 170 }, style: { background: '#fce7f3', color: '#000000' } },
      { type: 'default', data: { label: 'Outcome A1', textColor: '#000000' }, position: { x: 100, y: 300 }, style: { background: '#dcfce7', color: '#000000' } },
      { type: 'default', data: { label: 'Outcome A2', textColor: '#000000' }, position: { x: 300, y: 300 }, style: { background: '#dcfce7', color: '#000000' } },
      { type: 'default', data: { label: 'Outcome B1', textColor: '#000000' }, position: { x: 500, y: 300 }, style: { background: '#fef3c7', color: '#000000' } },
      { type: 'default', data: { label: 'Outcome B2', textColor: '#000000' }, position: { x: 700, y: 300 }, style: { background: '#fef3c7', color: '#000000' } },
    ]
  },
  {
    id: 'study-notes',
    name: 'Study Notes',
    description: 'Organise a topic into key areas',
    category: 'creative',
    nodes: [
      { type: 'default', data: { label: 'Subject', textColor: '#000000' }, position: { x: 400, y: 50 }, style: { background: '#e0e7ff', color: '#000000' } },
      { type: 'default', data: { label: 'Key Concept 1', textColor: '#000000' }, position: { x: 150, y: 180 }, style: { background: '#fef3c7', color: '#000000' } },
      { type: 'default', data: { label: 'Key Concept 2', textColor: '#000000' }, position: { x: 400, y: 180 }, style: { background: '#dbeafe', color: '#000000' } },
      { type: 'default', data: { label: 'Key Concept 3', textColor: '#000000' }, position: { x: 650, y: 180 }, style: { background: '#dcfce7', color: '#000000' } },
      { type: 'default', data: { label: 'Detail', textColor: '#000000' }, position: { x: 150, y: 310 }, style: { background: '#fff7ed', color: '#000000' } },
      { type: 'default', data: { label: 'Detail', textColor: '#000000' }, position: { x: 400, y: 310 }, style: { background: '#eff6ff', color: '#000000' } },
      { type: 'default', data: { label: 'Detail', textColor: '#000000' }, position: { x: 650, y: 310 }, style: { background: '#f0fdf4', color: '#000000' } },
    ]
  },
  {
    id: 'business-model',
    name: 'Business Model',
    description: 'Key business components overview',
    category: 'business',
    nodes: [
      { type: 'default', data: { label: 'Business Model', textColor: '#000000' }, position: { x: 400, y: 50 }, style: { background: '#e0e7ff', color: '#000000' } },
      { type: 'default', data: { label: 'Value Proposition', textColor: '#000000' }, position: { x: 400, y: 170 }, style: { background: '#fef3c7', color: '#000000' } },
      { type: 'default', data: { label: 'Customers', textColor: '#000000' }, position: { x: 150, y: 170 }, style: { background: '#dbeafe', color: '#000000' } },
      { type: 'default', data: { label: 'Revenue', textColor: '#000000' }, position: { x: 650, y: 170 }, style: { background: '#dcfce7', color: '#000000' } },
      { type: 'default', data: { label: 'Channels', textColor: '#000000' }, position: { x: 150, y: 300 }, style: { background: '#fce7f3', color: '#000000' } },
      { type: 'default', data: { label: 'Costs', textColor: '#000000' }, position: { x: 400, y: 300 }, style: { background: '#fef2f2', color: '#000000' } },
      { type: 'default', data: { label: 'Partners', textColor: '#000000' }, position: { x: 650, y: 300 }, style: { background: '#ede9fe', color: '#000000' } },
    ]
  },
];
