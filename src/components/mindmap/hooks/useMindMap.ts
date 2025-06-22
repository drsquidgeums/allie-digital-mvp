
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useMindMap = () => {
  const [mindMapData, setMindMapData] = useState({
    meta: {
      name: 'Mind Map',
      author: 'User',
      version: '1.0',
    },
    format: 'node_tree',
    data: {
      id: 'root',
      topic: 'Main Topic',
      children: [],
    },
  });
  
  const [newNodeText, setNewNodeText] = useState("");
  const { toast } = useToast();

  const addNode = useCallback((selectedColor: string, customColor: string) => {
    if (!newNodeText.trim()) return;
    
    const newNode = {
      id: `node_${Date.now()}`,
      topic: newNodeText,
      direction: Math.random() > 0.5 ? 'right' : 'left',
      style: {
        background: selectedColor === 'custom' ? customColor : selectedColor,
      },
    };

    setMindMapData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        children: [...(prev.data.children || []), newNode],
      },
    }));

    setNewNodeText("");
    
    toast({
      title: "Node added",
      description: "New mind map node has been created",
    });
  }, [newNodeText, toast]);

  const clearCanvas = useCallback(() => {
    setMindMapData({
      meta: {
        name: 'Mind Map',
        author: 'User',
        version: '1.0',
      },
      format: 'node_tree',
      data: {
        id: 'root',
        topic: 'Main Topic',
        children: [],
      },
    });
    
    toast({
      title: "Canvas cleared",
      description: "Mind map has been reset to initial state",
    });
  }, [toast]);

  const downloadMindMap = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mindMapData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "mindmap.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Download started",
      description: "Your mind map is being downloaded",
    });
  }, [mindMapData, toast]);

  return {
    mindMapData,
    newNodeText,
    setNewNodeText,
    addNode,
    clearCanvas,
    downloadMindMap,
  };
};
