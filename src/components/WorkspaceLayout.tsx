
import React from "react";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { useFileManager } from "@/hooks/useFileManager";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export const WorkspaceLayout = React.memo(({ children }: WorkspaceLayoutProps) => {
  const { files, uploadFile, deleteFile } = useFileManager();
  
  const handleFileUpload = async (file: File) => {
    try {
      await uploadFile(file);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="sticky top-0 h-screen">
        <Sidebar 
          onFileUpload={handleFileUpload}
          onColorChange={() => {}}
          uploadedFiles={files.map(f => f.file).filter(Boolean) as File[]}
          onFileSelect={() => {}}
          onFileDelete={(file) => {
            const fileToDelete = files.find(f => f.file === file);
            if (fileToDelete) {
              deleteFile(fileToDelete);
            }
          }}
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
