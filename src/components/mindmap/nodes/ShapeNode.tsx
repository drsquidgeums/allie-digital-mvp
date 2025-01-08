import React, { useState, useCallback } from 'react';
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

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleKeyDown = useCallback((evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') {
      setIsEditing(false);
    }
  }, []);

  return (
    <div className="relative">
      <NodeResizer 
        minWidth={100}
        minHeight={100}
        isVisible={selected}
      />
      <Handle type="target" position={Position.Top} />
      <div 
        className="w-full h-full flex items-center justify-center"
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="bg-transparent text-center border-none outline-none"
            autoFocus
          />
        ) : (
          <span className="text-sm">{label}</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};