
import React from 'react';
import { toast } from 'sonner';

interface NodeContextMenuProps {
  nodeId: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export const NodeContextMenu: React.FC<NodeContextMenuProps> = ({ nodeId, position, onClose }) => {
  const handleAction = (action: string) => {
    const event = new CustomEvent('nodeAction', {
      detail: { nodeId, action }
    });
    window.dispatchEvent(event);
    onClose();
    
    // Show feedback
    switch (action) {
      case 'duplicate':
        toast.success('Node duplicated');
        break;
      case 'delete':
        toast.success('Node deleted');
        break;
      case 'changeColor':
        toast.info('Use the color selector to change node color');
        break;
    }
  };

  return (
    <div
      className="fixed z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 min-w-[120px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
        onClick={() => handleAction('duplicate')}
      >
        <span>📋</span>
        Duplicate
      </button>
      <button
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
        onClick={() => handleAction('changeColor')}
      >
        <span>🎨</span>
        Change Color
      </button>
      <hr className="my-1 border-gray-200 dark:border-gray-700" />
      <button
        className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2"
        onClick={() => handleAction('delete')}
      >
        <span>🗑️</span>
        Delete
      </button>
    </div>
  );
};
