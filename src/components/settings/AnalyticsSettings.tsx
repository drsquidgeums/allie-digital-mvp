
import React from "react";
import { Separator } from "@/components/ui/separator";
import { AnalyticsDisplay } from "../analytics/AnalyticsDisplay";
import { CloudSyncSettings } from "../integrations/CloudSyncSettings";
import { CalendarSettings } from "../integrations/CalendarSettings";
import { NoteTakingSettings } from "../integrations/NoteTakingSettings";
import { useTranslation } from "react-i18next";

export const AnalyticsSettings = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('settings.analytics.title', 'Analytics & Insights')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('settings.analytics.description', 'Track your productivity and usage patterns')}
        </p>
      </div>
      
      <AnalyticsDisplay />
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium">{t('settings.integrations.title', 'Integrations')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('settings.integrations.description', 'Connect with your favorite apps and services')}
        </p>
      </div>
      
      <div className="space-y-4">
        <CloudSyncSettings />
        <CalendarSettings />
        <NoteTakingSettings />
      </div>
      
      <Separator />
    </div>
  );
};
