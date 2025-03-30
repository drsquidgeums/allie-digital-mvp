
import { Edge, Node as FlowNode, NodeChange, EdgeChange, Connection } from '@xyflow/react';

export interface NodeStyle {
  background?: string;
  color?: string;
  border?: string;
  width?: number;
  height?: number;
  borderRadius?: string;
}

// Define a more specific MindMapNode type that ensures all required fields are present
export interface MindMapNode extends FlowNode {
  id: string;
  type: string; // Make type required for our MindMapNode
  data: {
    label: string;
    textColor?: string;
    shape?: string;
    color?: string;
  };
  position: {
    x: number;
    y: number;
  };
  style?: NodeStyle;
}

export interface ColorOption {
  value: string;
  label: string;
}

export interface MindMapContainerProps {
  nodes: MindMapNode[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection | Edge) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  selectedTextColor: string;
  setSelectedTextColor: (color: string) => void;
  customTextColor: string;
  setCustomTextColor: (color: string) => void;
  newNodeText: string;
  setNewNodeText: (text: string) => void;
  onAddNode: () => void;
  onExportJpg: () => void;
  onExportJson: () => void;
  onClear: () => void;
  colorOptions: ColorOption[];
  textColorOptions: ColorOption[];
  nodeTypes: Record<string, React.ComponentType<any>>;
}
