
import React from "react";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { EnhancedFileManager } from "@/components/file-manager/EnhancedFileManager";
import { FileManagerErrorBoundary } from "@/components/file-manager/FileManagerErrorBoundary";
import { useTranslation } from "react-i18next";

const MyFilesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <WorkspaceLayout>
      <div className="p-6 space-y-6">
        <FileManagerErrorBoundary>
          <EnhancedFileManager />
        </FileManagerErrorBoundary>
      </div>
    </WorkspaceLayout>
  );
};

export default MyFilesPage;
