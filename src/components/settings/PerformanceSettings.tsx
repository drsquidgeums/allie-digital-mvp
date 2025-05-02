
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

export const PerformanceSettings = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('settings.performance.title', 'Performance')}</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t('settings.performance.autoSave', 'Auto-save')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.performance.autoSaveDescription', 'Automatically save changes')}</p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t('settings.performance.hardware', 'Hardware Acceleration')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.performance.hardwareDescription', 'Use GPU for better performance')}</p>
          </div>
          <Switch />
        </div>
      </div>
      <Separator />
    </div>
  );
};
