import React, { useEffect, useRef } from "react";
import { MindMap } from "@/components/MindMap";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { useTranslation } from "react-i18next";
import { useOnboarding } from "@/contexts/OnboardingContext";

const MindMapDashboard = React.memo(() => {
  const { t } = useTranslation();
  const { completeChecklistItem, onboardingEnabled } = useOnboarding();
  const hasTrackedRef = useRef(false);

  // Track mind map visit for onboarding
  useEffect(() => {
    if (!onboardingEnabled || hasTrackedRef.current) return;
    hasTrackedRef.current = true;
    completeChecklistItem("try-mind-map");
  }, [completeChecklistItem, onboardingEnabled]);
  
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
