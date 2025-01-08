import React from "react";
import { Card } from "@/components/ui/card";
import { MindMap } from "@/components/MindMap";
import { ReactFlowProvider } from '@xyflow/react';

const MindMapDashboard = () => {
  return (
    <Card className="h-full bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative">
      <div className="p-6">
        <ReactFlowProvider>
          <MindMap />
        </ReactFlowProvider>
      </div>
    </Card>
  );
};

export default MindMapDashboard;