export interface ColorOption {
  label: string;
  value: string;
}

export interface MindMapNode {
  id: string;
  type?: string;
  data: { label: string };
  position: { x: number; y: number };
  style?: React.CSSProperties;
}

export type Node = {
  id: string;
  type: string;
  data: { label: string };
  position: { x: number; y: number };
  style?: React.CSSProperties;
}