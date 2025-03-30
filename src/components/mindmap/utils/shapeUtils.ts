
import { CSSProperties } from 'react';

export const getShapeStyle = (shape: string, selectedColor: string, customColor: string): CSSProperties => {
  const colorValue = selectedColor === 'custom' ? customColor : selectedColor;
  
  let nodeStyle: CSSProperties = {
    background: colorValue,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
    minWidth: '100px',
    minHeight: '100px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    transition: 'box-shadow 0.2s ease-in-out',
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
    case 'sticky':
      return {
        ...nodeStyle,
        backgroundColor: '#FFEB3B',
        boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
        width: 150,
        height: 150,
        borderRadius: '2px',
      };
    case 'text':
      return {
        ...nodeStyle,
        background: 'transparent',
        boxShadow: 'none',
        border: 'none',
        width: 200,
        height: 'auto',
      };
    case 'image':
      return {
        padding: 0,
        background: 'transparent',
        border: 'none',
        width: 200,
        height: 150,
        objectFit: 'contain',
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
