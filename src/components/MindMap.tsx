import React, { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { MindMapContainer } from "./mindmap/MindMapContainer";
import { ColorOption } from "./mindmap/types";

export const MindMap = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [customColor, setCustomColor] = useState("#000000");
  const [newNodeText, setNewNodeText] = useState("");

  const onNodesChange = useCallback((changes: any) => {
    setNodes((nds: any) => {
      // Handle node changes
      return nds;
    });
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges((eds: any) => {
      // Handle edge changes
      return eds;
    });
  }, []);

  const onConnect = useCallback((params: any) => {
    // Handle connection
  }, []);

  const handleAddNode = () => {
    // Handle adding new node
  };

  const handleExport = () => {
    // Handle export
  };

  const handleClear = () => {
    // Handle clear
  };

  const colorOptions: ColorOption[] = [
    { label: "Black", value: "#000000" },
    { label: "Custom", value: "custom" },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        onFileUpload={() => {}} 
        onColorChange={() => {}}
        uploadedFiles={[]}
        onFileSelect={() => {}}
        onFileDelete={() => {}}
      />
      <div className="flex-1 min-h-screen bg-background">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Mind Map</h1>
            </div>
            <Card className="flex-1 p-6">
              <MindMapContainer 
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                customColor={customColor}
                setCustomColor={setCustomColor}
                newNodeText={newNodeText}
                setNewNodeText={setNewNodeText}
                onAddNode={handleAddNode}
                onExport={handleExport}
                onClear={handleClear}
                colorOptions={colorOptions}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};