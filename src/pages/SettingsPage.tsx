
import React from "react";
import { Settings } from "@/components/Settings";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { useTranslation } from "react-i18next";

const SettingsPage = () => {
  const { t } = useTranslation();
  
  return (
    <WorkspaceLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">{t('pages.settings')}</h1>
        <Settings />
      </div>
    </WorkspaceLayout>
  );
};

export default SettingsPage;
