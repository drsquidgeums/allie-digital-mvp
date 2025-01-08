export interface Color {
  name: string;
  value: string;
}

export interface ColorOptionProps {
  name: string;
  value: string;
  isSelected: boolean;
  onClick: () => void;
}

export interface ColorListProps {
  colors: Color[];
  selectedColor: string;
  onColorChange: (color: string) => void;
}