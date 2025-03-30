import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

interface ShapeNodeProps {
  id: string;
  data: {
    label: string;
    shape: string;
    color: string;
    textColor?: string;
  };
  selected: boolean;
}

export const ShapeNode: React.FC<ShapeNodeProps> = ({ data, selected }) => {
  const [label, setLabel] = useState(data.label);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleKeyDown = useCallback((evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') {
      setIsEditing(false);
    } else if (evt.key === 'Escape') {
      setLabel(data.label);
      setIsEditing(false);
    }
  }, [data.label]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div 
      className="relative group"
      role="button"
      aria-label={`${data.shape} node with text: ${label}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleDoubleClick();
        }
      }}
    >
      <NodeResizer 
        minWidth={100}
        minHeight={100}
        isVisible={selected}
        lineClassName="border-primary/30"
        handleClassName="h-3 w-3 bg-primary border-2 border-background"
      />
      
      <Handle 
        type="target" 
        position={Position.Top}
        className="w-3 h-3 bg-primary border-2 border-background opacity-100 group-hover:opacity-100 transition-opacity"
        role="button"
        aria-label="Connection target point"
        id="top"
      />
      
      <Handle 
        type="source" 
        position={Position.Left}
        className="w-3 h-3 bg-primary border-2 border-background opacity-0 group-hover:opacity-100 transition-opacity"
        role="button"
        aria-label="Connection source point"
        id="left"
      />
      
      <div 
        className="w-full h-full flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
        onDoubleClick={handleDoubleClick}
        style={{
          backgroundColor: data.color,
          color: data.textColor || getContrastColor(data.color),
          minHeight: '100px',
          minWidth: '100px',
          borderRadius: data.shape === 'circle' ? '50%' : '4px',
        }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="bg-transparent text-center border-none outline-none focus:ring-2 focus:ring-primary/50 px-2 py-1 w-full"
            style={{ color: data.textColor || getContrastColor(data.color) }}
            autoFocus
            aria-label="Edit node text"
          />
        ) : (
          <span className="text-sm font-medium p-2 text-center w-full break-words">{label || 'Double-click to edit'}</span>
        )}
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right}
        className="w-3 h-3 bg-primary border-2 border-background opacity-0 group-hover:opacity-100 transition-opacity"
        role="button"
        aria-label="Connection source point"
        id="right"
      />
      
      <Handle 
        type="source" 
        position={Position.Bottom}
        className="w-3 h-3 bg-primary border-2 border-background opacity-100 group-hover:opacity-100 transition-opacity"
        role="button"
        aria-label="Connection source point"
        id="bottom"
      />
    </div>
  );
};

// Helper function to ensure text contrast
function getContrastColor(bgColor: string): string {
  // Convert background color to RGB
  let color = bgColor;
  if (color.startsWith('hsl')) {
    // Convert HSL to RGB if needed
    const hsl = color.match(/\d+/g)?.map(Number);
    if (hsl) {
      const h = hsl[0];
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      // HSL to RGB conversion
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;
      let r = 0, g = 0, b = 0;
      if (h < 60) { r = c; g = x; }
      else if (h < 120) { r = x; g = c; }
      else if (h < 180) { g = c; b = x; }
      else if (h < 240) { g = x; b = c; }
      else if (h < 300) { r = x; b = c; }
      else { r = c; b = x; }
      color = `rgb(${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)})`;
    }
  }
  
  // Extract RGB values
  const rgb = color.match(/\d+/g)?.map(Number);
  if (!rgb) return '#000000';
  
  // Calculate relative luminance
  const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export default ShapeNode;
