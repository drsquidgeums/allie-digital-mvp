import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MindMap } from "@/components/MindMap";
import { ReactFlowProvider } from '@xyflow/react';

const MindMapDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Mind Map Dashboard</h1>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/')}
          >
            <Home className="h-5 w-5" />
          </Button>
        </div>
        <Card className="p-6">
          <ReactFlowProvider>
            <MindMap />
          </ReactFlowProvider>
        </Card>
      </div>
    </div>
  );
};

export default MindMapDashboard;