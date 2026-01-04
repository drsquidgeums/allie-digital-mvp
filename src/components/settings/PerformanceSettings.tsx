
import React from "react";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

export const PerformanceSettings = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('settings.performance.title', 'Performance')}</h3>
      <p className="text-sm text-muted-foreground">
        {t('settings.performance.comingSoon', 'Performance settings are coming soon.')}
      </p>
      <Separator />
    </div>
  );
};
