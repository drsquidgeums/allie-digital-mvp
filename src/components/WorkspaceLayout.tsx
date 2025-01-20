import React, { useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export const WorkspaceLayout = React.memo(({ children }: WorkspaceLayoutProps) => {
  // Memoize the callback functions
  const handleFileUpload = useCallback(() => {}, []);
  const handleColorChange = useCallback(() => {}, []);
  const handleFileSelect = useCallback(() => {}, []);
  const handleFileDelete = useCallback(() => {}, []);

  // Memoize the sidebar component
  const memoizedSidebar = useMemo(() => (
    <Sidebar 
      onFileUpload={handleFileUpload}
      onColorChange={handleColorChange}
      uploadedFiles={[]}
      onFileSelect={handleFileSelect}
      onFileDelete={handleFileDelete}
    />
  ), [handleFileUpload, handleColorChange, handleFileSelect, handleFileDelete]);

  // Memoize the content
  const memoizedContent = useMemo(() => (
    <div className="flex-1 p-6 overflow-y-auto">
      <Card className="h-full shadow-lg">
        {children}
      </Card>
    </div>
  ), [children]);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="sticky top-0 h-screen">
        {memoizedSidebar}
      </div>
      {memoizedContent}
    </div>
  );
});

WorkspaceLayout.displayName = "WorkspaceLayout";