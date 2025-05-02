
import React, { useEffect } from "react";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { FileManager } from "@/components/file-manager/FileManager";
import { useTranslation } from "react-i18next";

const MyFilesPage: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    console.log("MyFilesPage mounted");
  }, []);
  
  return (
    <WorkspaceLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">{t('pages.myFiles')}</h1>
        <FileManager />
      </div>
    </WorkspaceLayout>
  );
};

export default MyFilesPage;
