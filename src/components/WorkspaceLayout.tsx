import React from "react";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export const WorkspaceLayout = React.memo(({ children }: WorkspaceLayoutProps) => {
  // Create stable callback functions that won't trigger re-renders
  const handleFileUpload = React.useCallback(() => {}, []);
  const handleColorChange = React.useCallback(() => {}, []);
  const handleFileSelect = React.useCallback(() => {}, []);
  const handleFileDelete = React.useCallback(() => {}, []);

  // Memoize the sidebar component to prevent re-renders
  const memoizedSidebar = React.useMemo(() => (
    <Sidebar 
      onFileUpload={handleFileUpload}
      onColorChange={handleColorChange}
      uploadedFiles={[]}
      onFileSelect={handleFileSelect}
      onFileDelete={handleFileDelete}
    />
  ), [handleFileUpload, handleColorChange, handleFileSelect, handleFileDelete]);

  return (
    <div className="flex min-h-screen bg-background">
      {memoizedSidebar}
      <div className="flex-1 p-6 overflow-y-auto">
        <Card className="h-full shadow-lg">
          {children}
        </Card>
      </div>
    </div>
  );
});

WorkspaceLayout.displayName = "WorkspaceLayout";