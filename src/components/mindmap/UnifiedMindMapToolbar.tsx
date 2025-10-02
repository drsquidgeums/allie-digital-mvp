import React from 'react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Trash2, Undo2, Redo2, ZoomIn, ZoomOut, Maximize, Palette, Type, Layers, Sparkles, Lightbulb } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { VisualExportButtons } from './toolbar/VisualExportButtons';
import { LayoutType } from './hooks/useAutoLayout';
import { MindMapNode } from './types';
import { SHAPE_CONFIGS } from './constants/shapeConfigs';
import { ShapeButton } from './toolbar/ShapeButton';
import { getDarkModeDropdownClasses } from '@/utils/darkModeUtils';

interface UnifiedMindMapToolbarProps {
  onExportJpg: () => void;
  onExportJson: () => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onApplyLayout: (layoutType: LayoutType) => void;
  onLoadTemplate: (templateNodes: Omit<MindMapNode, 'id'>[]) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  selectedTextColor: string;
  setSelectedTextColor: (color: string) => void;
  customTextColor: string;
  setCustomTextColor: (color: string) => void;
  onShapeSelect: (shape: string, label?: string) => void;
  onAIGenerate?: (topic: string) => void;
  onAIExpand?: (nodeId: string) => void;
  isGenerating?: boolean;
  isExpanding?: boolean;
  nodes?: MindMapNode[];
}

export const UnifiedMindMapToolbar: React.FC<UnifiedMindMapToolbarProps> = ({
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
  selectedColor,
  setSelectedColor,
  customColor,
  setCustomColor,
  selectedTextColor,
  setSelectedTextColor,
  customTextColor,
  setCustomTextColor,
  onShapeSelect,
  onAIGenerate,
  onAIExpand,
  isGenerating,
  isExpanding,
  nodes,
}) => {
  const [aiTopic, setAiTopic] = React.useState('');
  const [showAIInput, setShowAIInput] = React.useState(false);
  const handleClear = () => {
    if (confirm("Clear the mind map? This cannot be undone.")) {
      onClear();
    }
  };

  const exportToPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const element = document.querySelector('.react-flow') as HTMLElement;
      
      if (!element) return;

      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(element, {
        backgroundColor: '#ffffff',
        width: element.offsetWidth,
        height: element.offsetHeight,
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [element.offsetWidth, element.offsetHeight]
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, element.offsetWidth, element.offsetHeight);
      pdf.save('mindmap.pdf');
    } catch (error) {
      console.error('PDF export error:', error);
    }
  };

  const shapeColors = [
    { value: 'hsl(var(--primary))', label: 'Primary', color: '#9b87f5' },
    { value: 'hsl(var(--secondary))', label: 'Secondary', color: '#7c3aed' },
    { value: 'hsl(var(--accent))', label: 'Accent', color: '#f59e0b' },
    { value: '#ef4444', label: 'Red', color: '#ef4444' },
    { value: '#10b981', label: 'Green', color: '#10b981' },
    { value: '#3b82f6', label: 'Blue', color: '#3b82f6' },
    { value: '#f59e0b', label: 'Yellow', color: '#f59e0b' },
    { value: '#8b5cf6', label: 'Purple', color: '#8b5cf6' },
  ];

  const textColors = [
    { value: 'auto', label: 'Auto', color: '#666666' },
    { value: 'hsl(var(--foreground))', label: 'Default', color: '#000000' },
    { value: '#ffffff', label: 'White', color: '#ffffff' },
    { value: '#000000', label: 'Black', color: '#000000' },
    { value: '#ef4444', label: 'Red', color: '#ef4444' },
    { value: '#10b981', label: 'Green', color: '#10b981' },
  ];

  const getCurrentShapeColor = () => {
    const color = shapeColors.find(c => c.value === selectedColor);
    return color ? color.color : customColor;
  };

  const getCurrentTextColor = () => {
    const color = textColors.find(c => c.value === selectedTextColor);
    return color ? color.color : customTextColor;
  };

  const templates = [
    {
      id: 'swot',
      name: 'SWOT Analysis',
      nodes: [
        { type: 'default', data: { label: 'SWOT Analysis' }, position: { x: 250, y: 50 } },
        { type: 'default', data: { label: 'Strengths' }, position: { x: 100, y: 150 } },
        { type: 'default', data: { label: 'Weaknesses' }, position: { x: 400, y: 150 } },
        { type: 'default', data: { label: 'Opportunities' }, position: { x: 100, y: 250 } },
        { type: 'default', data: { label: 'Threats' }, position: { x: 400, y: 250 } },
      ]
    },
    {
      id: 'project',
      name: 'Project Plan',
      nodes: [
        { type: 'default', data: { label: 'Project Plan' }, position: { x: 250, y: 50 } },
        { type: 'default', data: { label: 'Phase 1' }, position: { x: 100, y: 150 } },
        { type: 'default', data: { label: 'Phase 2' }, position: { x: 250, y: 150 } },
        { type: 'default', data: { label: 'Phase 3' }, position: { x: 400, y: 150 } },
      ]
    },
    {
      id: 'brainstorm',
      name: 'Brainstorm',
      nodes: [
        { type: 'default', data: { label: 'Main Idea' }, position: { x: 250, y: 150 } },
        { type: 'default', data: { label: 'Idea 1' }, position: { x: 100, y: 100 } },
        { type: 'default', data: { label: 'Idea 2' }, position: { x: 400, y: 100 } },
        { type: 'default', data: { label: 'Idea 3' }, position: { x: 100, y: 200 } },
        { type: 'default', data: { label: 'Idea 4' }, position: { x: 400, y: 200 } },
      ]
    }
  ];

  const layouts = [
    { type: 'radial' as const, name: 'Radial Layout' },
    { type: 'hierarchical' as const, name: 'Hierarchical Layout' },
    { type: 'force' as const, name: 'Force Layout' }
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <div className="p-3 border-b border-border/30 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Left Section - History & Templates */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onUndo}
                  disabled={!canUndo}
                  className="h-9 w-9 p-0"
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center" sideOffset={8} avoidCollisions={false}>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRedo}
                  disabled={!canRedo}
                  className="h-9 w-9 p-0"
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center" sideOffset={8} avoidCollisions={false}>Redo (Ctrl+Y)</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            {/* Templates */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <Layers className="h-4 w-4" />
                  <span className="hidden sm:inline">Templates</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Choose Template</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {templates.map((template) => (
                  <DropdownMenuItem
                    key={template.id}
                    onClick={() => onLoadTemplate(template.nodes)}
                    className="cursor-pointer"
                  >
                    {template.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Layout */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <div className="w-4 h-4 bg-primary/20 rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded"></div>
                  </div>
                  <span className="hidden sm:inline">Layout</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Auto Layout</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {layouts.map((layout) => (
                  <DropdownMenuItem
                    key={layout.type}
                    onClick={() => onApplyLayout(layout.type)}
                    className="cursor-pointer"
                  >
                    {layout.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-6" />

            {/* AI Features */}
            {onAIGenerate && (
              <DropdownMenu open={showAIInput} onOpenChange={setShowAIInput}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 gap-2 bg-primary/10 hover:bg-primary/20 border-primary/20"
                    disabled={isGenerating}
                  >
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="hidden sm:inline">AI Generate</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 p-3">
                  <DropdownMenuLabel>Generate Mind Map</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="space-y-2">
                    <Label htmlFor="ai-topic" className="text-sm">Topic</Label>
                    <Input
                      id="ai-topic"
                      placeholder="e.g., Marketing Strategy"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && aiTopic.trim()) {
                          onAIGenerate(aiTopic);
                          setAiTopic('');
                          setShowAIInput(false);
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        if (aiTopic.trim()) {
                          onAIGenerate(aiTopic);
                          setAiTopic('');
                          setShowAIInput(false);
                        }
                      }}
                      disabled={!aiTopic.trim() || isGenerating}
                    >
                      {isGenerating ? 'Generating...' : 'Generate'}
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {onAIExpand && nodes && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const selectedNode = nodes.find(n => n.selected);
                      if (selectedNode) {
                        onAIExpand(selectedNode.id);
                      }
                    }}
                    disabled={!nodes.some(n => n.selected) || isExpanding}
                    className="h-9 gap-2"
                  >
                    <Lightbulb className="h-4 w-4" />
                    <span className="hidden sm:inline">{isExpanding ? 'Expanding...' : 'AI Expand'}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center" sideOffset={8} avoidCollisions={false}>
                  Select a node and click to expand with AI suggestions
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Center Section - Shapes */}
          <div className="flex items-center gap-2 flex-1 justify-center min-w-0">
            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg overflow-x-auto max-w-full">
              {SHAPE_CONFIGS.shapes.map((shape) => (
                <ShapeButton
                  key={shape.id}
                  id={shape.id}
                  icon={shape.icon}
                  label={shape.label}
                  description={shape.description}
                  onClick={() => onShapeSelect(shape.id, '')}
                />
              ))}
              <Separator orientation="vertical" className="h-6 mx-1" />
              {SHAPE_CONFIGS.tools.map((tool) => (
                <ShapeButton
                  key={tool.id}
                  id={tool.id}
                  icon={tool.icon}
                  label={tool.label}
                  description={tool.description}
                  onClick={() => onShapeSelect(tool.id, '')}
                />
              ))}
            </div>
          </div>

          {/* Right Section - Colors, Zoom, Export */}
          <div className="flex items-center gap-2">
            {/* Colors */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <Palette className="h-4 w-4" />
                  <div 
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: getCurrentShapeColor() }}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={`w-48 ${getDarkModeDropdownClasses()}`}>
                <DropdownMenuLabel>Shape Color</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {shapeColors.map((color) => (
                  <DropdownMenuItem
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className="cursor-pointer flex items-center gap-3"
                  >
                    <div 
                      className="w-5 h-5 rounded-full border border-border"
                      style={{ backgroundColor: color.color }}
                    />
                    <span>{color.label}</span>
                    {selectedColor === color.value && (
                      <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'color';
                    input.value = customColor;
                    input.onchange = (e) => {
                      const target = e.target as HTMLInputElement;
                      setCustomColor(target.value);
                      setSelectedColor('custom');
                    };
                    input.click();
                  }}
                  className="cursor-pointer"
                >
                  <div 
                    className="w-5 h-5 rounded-full border border-border mr-3"
                    style={{ backgroundColor: customColor }}
                  />
                  Custom Color
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <Type className="h-4 w-4" />
                  <div 
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: getCurrentTextColor() }}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={`w-48 ${getDarkModeDropdownClasses()}`}>
                <DropdownMenuLabel>Text Color</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {textColors.map((color) => (
                  <DropdownMenuItem
                    key={color.value}
                    onClick={() => setSelectedTextColor(color.value)}
                    className="cursor-pointer flex items-center gap-3"
                  >
                    <div 
                      className={`w-5 h-5 rounded-full border border-border ${
                        color.color === '#ffffff' ? 'border-2' : ''
                      }`}
                      style={{ backgroundColor: color.color }}
                    />
                    <span>{color.label}</span>
                    {selectedTextColor === color.value && (
                      <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'color';
                    input.value = customTextColor;
                    input.onchange = (e) => {
                      const target = e.target as HTMLInputElement;
                      setCustomTextColor(target.value);
                      setSelectedTextColor('custom');
                    };
                    input.click();
                  }}
                  className="cursor-pointer"
                >
                  <div 
                    className="w-5 h-5 rounded-full border border-border mr-3"
                    style={{ backgroundColor: customTextColor }}
                  />
                  Custom Text
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-6" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onZoomOut}
                    className="h-8 w-8 p-0"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center" sideOffset={8} avoidCollisions={false}>Zoom Out</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onZoomIn}
                    className="h-8 w-8 p-0"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center" sideOffset={8} avoidCollisions={false}>Zoom In</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onFitView}
                    className="h-8 w-8 p-0"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center" sideOffset={8} avoidCollisions={false}>Fit View</TooltipContent>
              </Tooltip>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Export & Clear */}
            <VisualExportButtons
              onExportJpg={onExportJpg}
              onExportJson={onExportJson}
              onExportPdf={exportToPDF}
            />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10 border-destructive/30"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center" sideOffset={8} avoidCollisions={false}>Clear Mind Map</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
