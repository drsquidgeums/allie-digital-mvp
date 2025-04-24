
import React, { useEffect } from "react";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { FileManager } from "@/components/file-manager/FileManager";

const MyFilesPage: React.FC = () => {
  useEffect(() => {
    console.log("MyFilesPage mounted");
  }, []);
  
  return (
    <WorkspaceLayout>
      <div className="p-6 space-y-6">
        <FileManager />
      </div>
    </WorkspaceLayout>
  );
};

export default MyFilesPage;
