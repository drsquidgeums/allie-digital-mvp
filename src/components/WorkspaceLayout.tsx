import React from "react";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export const WorkspaceLayout = React.memo(({ children }: WorkspaceLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="sticky top-0 h-screen">
        <Sidebar 
          onFileUpload={() => {}}
          onColorChange={() => {}}
          uploadedFiles={[]}
          onFileSelect={() => {}}
          onFileDelete={() => {}}
        />
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <Card className="h-full shadow-lg">
          {children}
        </Card>
      </div>
    </div>
  );
});

WorkspaceLayout.displayName = "WorkspaceLayout";