import React, { useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { MindMapToolbar } from './mindmap/MindMapToolbar';
import { ColorOption } from './mindmap/types';
import { useMindMap } from './mindmap/hooks/useMindMap';

declare global {
  interface Window {
    jsMind: any;
  }
}

const colorOptions: ColorOption[] = [
  { label: 'Default', value: 'hsl(var(--muted))' },
  { label: 'Purple', value: '#E5DEFF' },
  { label: 'Green', value: '#F2FCE2' },
  { label: 'Yellow', value: '#FEF7CD' },
  { label: 'Orange', value: '#FEC6A1' },
  { label: 'Pink', value: '#FFDEE2' },
  { label: 'Blue', value: '#D3E4FD' },
  { label: 'Custom', value: 'custom' },
];

export const MindMap = () => {
  const [selectedColor, setSelectedColor] = React.useState(colorOptions[0].value);
  const [customColor, setCustomColor] = React.useState("#FFFFFF");
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const mindMapRef = useRef<any>(null);
  
  const {
    mindMapData,
    newNodeText,
    setNewNodeText,
    addNode,
    clearCanvas,
    downloadMindMap
  } = useMindMap();

  useEffect(() => {
    if (containerRef.current && mindMapData && window.jsMind) {
      const options = {
        container: containerRef.current,
        theme: 'primary',
        editable: true,
        theme_color: selectedColor === 'custom' ? customColor : selectedColor,
        view: {
          engine: 'canvas',
          hmargin: 100,
          vmargin: 50,
          line_width: 2,
          line_color: '#555'
        }
      };

      mindMapRef.current = new window.jsMind(options);
      mindMapRef.current.show(mindMapData);

      return () => {
        if (mindMapRef.current) {
          try {
            mindMapRef.current.destroy();
          } catch (e) {
            console.error('Error destroying mind map:', e);
          }
        }
      };
    }
  }, [mindMapData, selectedColor, customColor]);

  const handleColorChange = (value: string) => {
    if (value === 'custom') {
      setSelectedColor(customColor);
    } else {
      setSelectedColor(value);
    }
    
    if (mindMapRef.current) {
      mindMapRef.current.set_theme_color(value === 'custom' ? customColor : value);
    }
  };

  const handleAddNode = () => {
    if (newNodeText.trim()) {
      addNode(selectedColor, customColor);
      if (mindMapRef.current) {
        mindMapRef.current.refresh();
      }
    }
  };

  return (
    <div className="w-full h-[600px] bg-background rounded-lg border">
      <MindMapToolbar
        selectedColor={selectedColor}
        setSelectedColor={handleColorChange}
        customColor={customColor}
        setCustomColor={setCustomColor}
        newNodeText={newNodeText}
        setNewNodeText={setNewNodeText}
        onAddNode={handleAddNode}
        onExport={downloadMindMap}
        onClear={clearCanvas}
        colorOptions={colorOptions}
      />
      <div 
        ref={containerRef} 
        className="w-full h-[calc(100%-64px)] bg-background"
      />
    </div>
  );
};