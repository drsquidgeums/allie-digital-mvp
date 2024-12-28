import React from "react";
import { Sidebar } from "./Sidebar";
import { DocumentViewer } from "./DocumentViewer";
import { NotificationCenter } from "./NotificationCenter";
import { useToast } from "@/hooks/use-toast";

export const WorkspaceLayout = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileUpload = (file: File) => {
    if (file.type === "application/pdf" || file.type === "application/msword" || 
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      setSelectedFile(file);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been added to your workspace`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOC file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onFileUpload={handleFileUpload} />
      <main className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-2xl font-semibold">Workspace</h1>
          <NotificationCenter />
        </div>
        <div className="h-[calc(100%-4rem)] overflow-auto">
          <DocumentViewer file={selectedFile} />
        </div>
      </main>
    </div>
  );
};