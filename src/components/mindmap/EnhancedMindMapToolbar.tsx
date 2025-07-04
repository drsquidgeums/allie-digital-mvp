
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Plus, 
  Download, 
  Upload, 
  Trash2, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  Maximize,
  Save,
  Grid,
  TreePine,
  Circle,
  Square,
  Triangle,
  Star,
  Diamond
} from 'lucide-react';

interface EnhancedMindMapToolbarProps {
  newNodeText: string;
  setNewNodeText: (text: string) => void;
  onAddNode: () => void;
  onExportJpg: () => void;
  onExportJson: () => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onApplyLayout: (layoutType: any) => void;
  onLoadTemplate: (templateNodes: any) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
}

export const EnhancedMindMapToolbar: React.FC<EnhancedMindMapToolbarProps> = ({
  newNodeText,
  setNewNodeText,
  onAddNode,
  onExportJpg,
  onExportJson,
  onClear,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onApplyLayout,
  onLoadTemplate,
  onZoomIn,
  onZoomOut,
  onFitView,
}) => {
  const [selectedShape, setSelectedShape] = useState<string>('rectangle');

  const handleAddShapeNode = (shape: string) => {
    setSelectedShape(shape);
    const event = new CustomEvent('addShapeNode', {
      detail: { shape, label: newNodeText || `New ${shape}` }
    });
    window.dispatchEvent(event);
    setNewNodeText('');
    toast.success(`Added ${shape} node`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onAddNode();
    }
  };

  const quickTemplates = [
    { name: 'Brainstorm', icon: '💭' },
    { name: 'Project Plan', icon: '📋' },
    { name: 'Decision Tree', icon: '🌳' },
    { name: 'SWOT Analysis', icon: '📊' }
  ];

  const shapes = [
    { name: 'rectangle', icon: Square, label: 'Rectangle' },
    { name: 'circle', icon: Circle, label: 'Circle' },
    { name: 'triangle', icon: Triangle, label: 'Triangle' },
    { name: 'diamond', icon: Diamond, label: 'Diamond' },
    { name: 'star', icon: Star, label: 'Star' }
  ];

  return (
    <div className="bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center gap-3 flex-wrap">
      {/* Node Creation Section */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Enter node text..."
          value={newNodeText}
          onChange={(e) => setNewNodeText(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-48 h-8"
          aria-label="New node text"
        />
        <Button
          onClick={onAddNode}
          size="sm"
          className="h-8"
          disabled={!newNodeText.trim()}
          title="Add text node (Enter)"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Node
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Shape Nodes Section */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground mr-2">Shapes:</span>
        {shapes.map(({ name, icon: Icon, label }) => (
          <Button
            key={name}
            variant={selectedShape === name ? "default" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleAddShapeNode(name)}
            title={`Add ${label}`}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* History Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Layout Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => onApplyLayout('hierarchical')}
          title="Auto Layout - Hierarchical"
        >
          <TreePine className="h-4 w-4 mr-1" />
          Layout
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* View Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onZoomIn}
          title="Zoom In (Ctrl++)"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onZoomOut}
          title="Zoom Out (Ctrl+-)"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onFitView}
          title="Fit to View (Ctrl+0)"
        >
          <Maximize className="h-4 w-4" />
        </Button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Export/Import Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={onExportJson}
          title="Save Mind Map"
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={onExportJpg}
          title="Export as Image"
        >
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-destructive hover:text-destructive"
          onClick={onClear}
          title="Clear Canvas"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      {/* Quick Templates */}
      <div className="flex items-center gap-1 ml-2">
        <span className="text-xs text-muted-foreground mr-1">Templates:</span>
        {quickTemplates.map((template) => (
          <Button
            key={template.name}
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => {
              // Load template logic would go here
              toast.info(`Loading ${template.name} template...`);
            }}
            title={`Load ${template.name} template`}
          >
            <span className="mr-1">{template.icon}</span>
            {template.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
