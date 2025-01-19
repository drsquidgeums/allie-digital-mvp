import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export const WorkspaceLayout = React.memo(({ children }: WorkspaceLayoutProps) => {
  const memoizedSidebar = useMemo(() => (
    <Sidebar 
      onFileUpload={() => {}} 
      onColorChange={() => {}}
      uploadedFiles={[]}
      onFileSelect={() => {}}
      onFileDelete={() => {}}
    />
  ), []);

  const memoizedContent = useMemo(() => (
    <div className="flex-1 p-6 min-h-screen overflow-y-auto">
      <Card className="h-full shadow-lg">
        {children}
      </Card>
    </div>
  ), [children]);

  return (
    <div className="flex min-h-screen h-full bg-background">
      <div className="sticky top-0 h-screen">
        {memoizedSidebar}
      </div>
      {memoizedContent}
    </div>
  );
});

WorkspaceLayout.displayName = "WorkspaceLayout";