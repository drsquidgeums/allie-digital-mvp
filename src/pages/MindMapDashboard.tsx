import React from "react";
import { MindMap } from "@/components/MindMap";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { useTranslation } from "react-i18next";

const MindMapDashboard = React.memo(() => {
  const { t } = useTranslation();
  
  return (
    <WorkspaceLayout>
      <div className="p-6 h-full overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">{t('mindMap.title')}</h1>
          <p className="text-muted-foreground">{t('mindMap.description')}</p>
        </div>
        <div className="bg-background rounded-lg shadow-sm h-[calc(100%-5rem)]">
          <MindMap />
        </div>
      </div>
    </WorkspaceLayout>
  );
});

MindMapDashboard.displayName = "MindMapDashboard";

export default MindMapDashboard;
