import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

interface ShapeNodeProps {
  id: string;
  data: {
    label: string;
    shape: string;
    color: string;
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
    }
  }, [isEditing]);

  return (
    <div 
      className="relative"
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
      />
      <Handle 
        type="target" 
        position={Position.Top}
        role="button"
        aria-label="Connection target point"
      />
      <div 
        className="w-full h-full flex items-center justify-center"
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="bg-transparent text-center border-none outline-none focus:ring-2 focus:ring-ring"
            autoFocus
            aria-label="Edit node text"
          />
        ) : (
          <span className="text-sm">{label}</span>
        )}
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom}
        role="button"
        aria-label="Connection source point"
      />
    </div>
  );
};