
import React from "react";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export const WorkspaceLayout = React.memo(({ children }: WorkspaceLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="sticky top-0 h-screen sidebar-elevated border-r-2 border-primary/10">
        <Sidebar 
          onColorChange={() => {}}
        />
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Visual breadcrumb indicator */}
        <div className="nav-breadcrumb mb-4">
          <span className="text-primary font-medium">Workspace</span>
          <span className="separator">›</span>
          <span>Document Viewer</span>
        </div>
        
        <div className="card-elevated h-full shadow-lg relative overflow-hidden">
          {/* Progress indicator at top */}
          <div className="progress-indicator absolute top-0 left-0 right-0 z-10" style={{"--progress": "100%"} as any} />
          
          <div className="content-container h-full pt-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
});

WorkspaceLayout.displayName = "WorkspaceLayout";
