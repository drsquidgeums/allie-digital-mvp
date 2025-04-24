
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SettingsSection } from "./SettingsSection";
import { useTranslation } from "react-i18next";

export const DisplaySettings = () => {
  const { t } = useTranslation();
  
  return (
    <SettingsSection title={t('settings.display.title', 'Display')}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>{t('settings.display.compactMode', 'Compact Mode')}</Label>
          <p className="text-sm text-muted-foreground">
            {t('settings.display.compactModeDescription', 'Reduce spacing between elements')}
          </p>
        </div>
        <Switch />
      </div>
    </SettingsSection>
  );
};
