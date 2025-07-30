
import React from "react";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export const WorkspaceLayout = React.memo(({ children }: WorkspaceLayoutProps) => {
  return (
    <div className="workspace-modern flex min-h-screen">
      <div className="sticky top-0 h-screen sidebar-modern">
        <Sidebar 
          onColorChange={() => {}}
        />
      </div>
      <div className="flex-1 section-modern overflow-y-auto">
        <div className="card-elevated h-full animate-in">
          <div className="content-container h-full section-modern">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
});

WorkspaceLayout.displayName = "WorkspaceLayout";
