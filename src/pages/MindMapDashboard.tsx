import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MindMap } from "@/components/MindMap";
import { ReactFlowProvider } from '@xyflow/react';
import { Sidebar } from "@/components/Sidebar";

const MindMapDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        onFileUpload={() => {}} 
        onColorChange={() => {}}
        uploadedFiles={[]}
        onFileSelect={() => {}}
        onFileDelete={() => {}}
      />
      <div className="flex-1 min-h-screen bg-background p-6">
        <div className="max-w-[1200px] mx-auto space-y-6">
          <Card className="p-6">
            <ReactFlowProvider>
              <MindMap />
            </ReactFlowProvider>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MindMapDashboard;