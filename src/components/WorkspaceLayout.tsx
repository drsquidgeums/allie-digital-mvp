
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
      console.log("Uploading file in WorkspaceLayout:", file.name);
      await uploadFile(file);
    } catch (error) {
      console.error("Error uploading file in WorkspaceLayout:", error);
    }
  };

  const handleFileDelete = (file: File) => {
    const fileToDelete = files.find(f => 
      f.file && f.file.name === file.name && f.file.size === file.size
    );
    
    if (fileToDelete) {
      console.log("Deleting file in WorkspaceLayout:", fileToDelete.name);
      deleteFile(fileToDelete);
    } else {
      console.error("Could not find file to delete:", file.name);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="sticky top-0 h-screen">
        <Sidebar 
          onFileUpload={handleFileUpload}
          onColorChange={() => {}}
          uploadedFiles={files.filter(f => f.file).map(f => f.file!)}
          onFileSelect={() => {}}
          onFileDelete={handleFileDelete}
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
