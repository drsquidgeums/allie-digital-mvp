
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import { SettingsSection } from "./SettingsSection";

export const PerformanceSettings = () => {
  const { t } = useTranslation();
  
  return (
    <SettingsSection title={t('settings.performance.title')}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>{t('settings.performance.autoSave')}</Label>
          <p className="text-sm text-muted-foreground">{t('settings.performance.autoSaveDescription')}</p>
        </div>
        <Switch />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>{t('settings.performance.hardware')}</Label>
          <p className="text-sm text-muted-foreground">{t('settings.performance.hardwareDescription')}</p>
        </div>
        <Switch />
      </div>
    </SettingsSection>
  );
};
