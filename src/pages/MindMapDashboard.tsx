
import React from "react";
import { MindMap } from "@/components/MindMap";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";

const MindMapDashboard = React.memo(() => {
  return (
    <WorkspaceLayout>
      <div className="p-6 h-full">
        <div className="bg-background rounded-lg shadow-sm h-full">
          <MindMap />
        </div>
      </div>
    </WorkspaceLayout>
  );
});

MindMapDashboard.displayName = "MindMapDashboard";

export default MindMapDashboard;
