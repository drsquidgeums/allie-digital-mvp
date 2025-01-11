import React from "react";
import { MindMap } from "@/components/MindMap";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";

const MindMapDashboard = React.memo(() => {
  return (
    <WorkspaceLayout>
      <MindMap />
    </WorkspaceLayout>
  );
});

MindMapDashboard.displayName = "MindMapDashboard";

export default MindMapDashboard;