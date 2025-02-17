
export interface ColorOption {
  label: string;
  value: string;
}

export interface NodeStyle extends React.CSSProperties {
  background: string;
  color: string;
}

export interface MindMapNode {
  id: string;
  type?: string;
  data: { 
    label: string;
    textColor: string;
  };
  position: { x: number; y: number };
  style: NodeStyle;  // Made style required
}

export type Node = {
  id: string;
  type: string;
  data: { 
    label: string;
    textColor: string;
  };
  position: { x: number; y: number };
  style: NodeStyle;  // Made style required
}

export interface MindMapContainerProps {
  nodes: Node[];
  edges: any[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
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
  nodeTypes: any;
}
