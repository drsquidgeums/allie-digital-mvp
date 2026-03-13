
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
      <div className="flex-1 overflow-y-auto bg-card">
        <div className="h-full animate-in">
          {children}
        </div>
      </div>
    </div>
  );
});

WorkspaceLayout.displayName = "WorkspaceLayout";
