import { CSSProperties } from 'react';

export const getShapeStyle = (shape: string, selectedColor: string, customColor: string): CSSProperties => {
  let nodeStyle: CSSProperties = {
    background: selectedColor === 'custom' ? customColor : selectedColor,
    border: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
    minWidth: '100px',
    minHeight: '100px',
  };

  switch (shape) {
    case 'circle':
      return {
        ...nodeStyle,
        borderRadius: '50%',
        width: 100,
        height: 100,
      };
    case 'triangle':
      return {
        ...nodeStyle,
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        width: 100,
        height: 100,
      };
    case 'diamond':
      return {
        ...nodeStyle,
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        width: 100,
        height: 100,
      };
    case 'hexagon':
      return {
        ...nodeStyle,
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        width: 120,
        height: 100,
      };
    case 'star':
      return {
        ...nodeStyle,
        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        width: 100,
        height: 100,
      };
    case 'image':
      return {
        padding: 0,
        background: 'transparent',
        border: 'none',
      };
    default:
      return {
        ...nodeStyle,
        width: 150,
        height: 100,
        borderRadius: '4px',
      };
  }
};