import React from "react";
import { Card } from "@/components/ui/card";
import { MindMap } from "@/components/MindMap";
import { Sidebar } from "@/components/Sidebar";

const MindMapDashboard = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        onFileUpload={() => {}} 
        onColorChange={() => {}}
        uploadedFiles={[]}
        onFileSelect={() => {}}
        onFileDelete={() => {}}
      />
      <div className="flex-1 p-6">
        <Card className="h-full shadow-lg">
          <MindMap />
        </Card>
      </div>
    </div>
  );
};

export default MindMapDashboard;