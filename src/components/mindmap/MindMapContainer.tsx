
import React from 'react';
import { MindMapToolbar } from './MindMapToolbar';
import { MindMapFlow } from './MindMapFlow';
import { MindMapCreativeToolbar } from './MindMapCreativeToolbar';
import { MindMapContainerProps } from './types';
import { toast } from "sonner";
import { ReactFlowProvider } from '@xyflow/react';
import { getShapeStyle } from './utils/shapeUtils';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFocusMode } from '@/hooks/useFocusMode';

export const MindMapContainer: React.FC<MindMapContainerProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  selectedColor,
  setSelectedColor,
  customColor,
  setCustomColor,
  selectedTextColor,
  setSelectedTextColor,
  customTextColor,
  setCustomTextColor,
  newNodeText,
  setNewNodeText,
  onAddNode,
  onExportJpg,
  onExportJson,
  onClear,
  colorOptions,
  textColorOptions,
  nodeTypes,
}) => {
  // Add deleteNode prop to hook up to useMindMapState's deleteNode function
  const handleDeleteNode = (nodeId: string) => {
    onNodesChange([{ type: 'remove', id: nodeId }]);
    toast(`Node deleted`);
  };

  const { isFocusModeActive } = useFocusMode();

  const handleExitFocusMode = () => {
    console.log("Exiting focus mode from MindMapContainer");
    // First update localStorage directly to ensure immediate state change
    localStorage.setItem('focusModeActive', 'false');
    
    // Then dispatch the global exit event
    window.dispatchEvent(new CustomEvent('focusModeExit'));
    
    // Ensure the focusModeChanged event is also fired
    window.dispatchEvent(new CustomEvent('focusModeChanged', { 
      detail: { 
        active: false,
        settings: null
      } 
    }));
    
    toast("Focus mode deactivated");
  };

  const handleShapeSelect = (shape: string, label?: string) => {
    const nodeStyle = getShapeStyle(shape, selectedColor, customColor);

    const newNode = {
      id: `${shape}_${Date.now()}`,
      type: shape === 'image' ? 'imageNode' : 'shapeNode',
      data: { 
        label: label || '',
        shape,
        color: selectedColor === 'custom' ? customColor : selectedColor,
        textColor: selectedTextColor === 'custom' ? customTextColor : selectedTextColor
      },
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      style: nodeStyle,
    };

    onNodesChange([{ type: 'add', item: newNode }]);
    toast(`Added ${shape} node`);
  };

  return (
    <div 
      className="w-full h-[calc(100vh-12rem)] bg-background rounded-xl overflow-hidden flex flex-col shadow-lg animate-fade-in relative"
      role="application"
      aria-label="Mind map editor"
    >
      <MindMapToolbar
        newNodeText={newNodeText}
        setNewNodeText={setNewNodeText}
        onAddNode={onAddNode}
        onExportJpg={onExportJpg}
        onExportJson={onExportJson}
        onClear={onClear}
      />
      <div className="flex-1 min-h-0 relative">
        <ReactFlowProvider>
          <MindMapFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onDeleteNode={handleDeleteNode}
          />
        </ReactFlowProvider>
        
        {/* Focus mode exit button */}
        {isFocusModeActive && (
          <div className="absolute top-2 right-2 z-50">
            <Button 
              size="sm"
              variant="outline"
              className="bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-full h-8 w-8 p-0 shadow-md"
              onClick={handleExitFocusMode}
              aria-label="Exit focus mode"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <MindMapCreativeToolbar 
            onShapeSelect={handleShapeSelect}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            customColor={customColor}
            setCustomColor={setCustomColor}
            selectedTextColor={selectedTextColor}
            setSelectedTextColor={setSelectedTextColor}
            customTextColor={customTextColor}
            setCustomTextColor={setCustomTextColor}
          />
        </div>
      </div>
    </div>
  );
};
