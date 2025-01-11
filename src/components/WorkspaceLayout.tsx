import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout = React.memo(({ children }: WorkspaceLayoutProps) => {
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
    <div className="flex-1 p-6">
      <Card className="h-full shadow-lg">
        {children}
      </Card>
    </div>
  ), [children]);

  return (
    <div className="flex h-screen bg-background">
      {memoizedSidebar}
      {memoizedContent}
    </div>
  );
});

WorkspaceLayout.displayName = "WorkspaceLayout";

export default WorkspaceLayout;