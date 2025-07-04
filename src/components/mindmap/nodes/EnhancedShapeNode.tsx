
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { NodeContextMenu } from './NodeContextMenu';

interface EnhancedShapeNodeProps {
  id: string;
  data: {
    label: string;
    shape: string;
    color: string;
    textColor?: string;
  };
  selected: boolean;
}

export const EnhancedShapeNode: React.FC<EnhancedShapeNodeProps> = ({ id, data, selected }) => {
  const [label, setLabel] = useState(data.label);
  const [isEditing, setIsEditing] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    // Update node data through React Flow's mechanism
    if (nodeRef.current) {
      const event = new CustomEvent('nodeUpdate', {
        detail: { id, updates: { label } }
      });
      window.dispatchEvent(event);
    }
  }, [id, label]);

  const handleKeyDown = useCallback((evt: React.KeyboardEvent<HTMLInputElement>) => {
    evt.stopPropagation();
    if (evt.key === 'Enter') {
      setIsEditing(false);
      handleBlur();
    } else if (evt.key === 'Escape') {
      setLabel(data.label);
      setIsEditing(false);
    }
  }, [data.label, handleBlur]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  }, []);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(false);
    if (showContextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showContextMenu]);

  const nodeStyle = {
    backgroundColor: data.color,
    color: data.textColor || getContrastColor(data.color),
    minHeight: '100px',
    minWidth: '100px',
    borderRadius: data.shape === 'circle' ? '50%' : '4px',
    transition: 'all 0.2s ease',
    transform: selected ? 'scale(1.02)' : 'scale(1)',
    boxShadow: selected 
      ? '0 4px 12px rgba(0, 0, 0, 0.15)' 
      : '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  return (
    <>
      <div 
        ref={nodeRef}
        className="relative group"
        role="button"
        aria-label={`${data.shape} node with text: ${label}`}
        tabIndex={0}
        title={selected ? "Press Delete to remove, double-click to edit" : "Double-click to edit"}
        onContextMenu={handleContextMenu}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleDoubleClick(e as any);
          }
        }}
      >
        <NodeResizer 
          minWidth={80}
          minHeight={80}
          isVisible={selected}
          lineClassName="border-primary/40"
          handleClassName="h-3 w-3 bg-primary border-2 border-background rounded-sm"
        />
        
        {/* Connection Handles */}
        <Handle 
          type="target" 
          position={Position.Top}
          className="w-3 h-3 bg-primary border-2 border-background opacity-0 group-hover:opacity-100 transition-opacity"
          id="top"
          aria-label="Top connection point"
        />
        
        <Handle 
          type="source" 
          position={Position.Left}
          className="w-3 h-3 bg-primary border-2 border-background opacity-0 group-hover:opacity-100 transition-opacity"
          id="left"
          aria-label="Left connection point"
        />
        
        <div 
          className="w-full h-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
          onDoubleClick={handleDoubleClick}
          style={nodeStyle}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={label}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-center border-none outline-none focus:ring-2 focus:ring-primary/50 px-2 py-1 w-full"
              style={{ color: data.textColor || getContrastColor(data.color) }}
              aria-label="Edit node text"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span 
              className="text-sm font-medium p-2 text-center w-full break-words select-none"
              style={{ wordBreak: 'break-word', hyphens: 'auto' }}
            >
              {label || 'Double-click to edit'}
            </span>
          )}
        </div>
        
        <Handle 
          type="source" 
          position={Position.Right}
          className="w-3 h-3 bg-primary border-2 border-background opacity-0 group-hover:opacity-100 transition-opacity"
          id="right"
          aria-label="Right connection point"
        />
        
        <Handle 
          type="source" 
          position={Position.Bottom}
          className="w-3 h-3 bg-primary border-2 border-background opacity-0 group-hover:opacity-100 transition-opacity"
          id="bottom"
          aria-label="Bottom connection point"
        />
      </div>

      {showContextMenu && (
        <NodeContextMenu
          nodeId={id}
          position={contextMenuPosition}
          onClose={() => setShowContextMenu(false)}
        />
      )}
    </>
  );
};

function getContrastColor(bgColor: string): string {
  let color = bgColor;
  if (color.startsWith('hsl')) {
    const hsl = color.match(/\d+/g)?.map(Number);
    if (hsl) {
      const h = hsl[0];
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
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
  
  const rgb = color.match(/\d+/g)?.map(Number);
  if (!rgb) return '#000000';
  
  const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export default EnhancedShapeNode;
