
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export const WorkspaceLayout = React.memo(({ children }: WorkspaceLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background relative">
      <div className={`transition-all duration-300 ${sidebarCollapsed ? "w-0 -ml-64" : "w-64 ml-0"} sticky top-0 h-screen md:block z-10`}>
        <Sidebar 
          onFileUpload={() => {}}
          onColorChange={() => {}}
          uploadedFiles={[]}
          onFileSelect={() => {}}
          onFileDelete={() => {}}
        />
      </div>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 left-4 z-20 md:hidden"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 left-64 z-20 hidden md:flex"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      <div className={`flex-1 p-3 sm:p-4 md:p-6 transition-all duration-300 overflow-y-auto ${sidebarCollapsed ? "ml-0" : "ml-0 md:ml-0"}`}>
        <Card className="h-full shadow-lg">
          {children}
        </Card>
      </div>
    </div>
  );
});

WorkspaceLayout.displayName = "WorkspaceLayout";
