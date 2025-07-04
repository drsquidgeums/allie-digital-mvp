
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SettingsSection } from "./SettingsSection";
import { useTranslation } from "react-i18next";

export const DisplaySettings = () => {
  const { t } = useTranslation();
  
  return (
    <SettingsSection title={t('settings.display.title', 'Display')}>
      <div className="flex items-center justify-between p-4 card-elevated">
        <div className="space-tight">
          <Label className="label-primary">
            {t('settings.display.compactMode', 'Compact Mode')}
          </Label>
          <p className="text-sm text-muted-enhanced">
            {t('settings.display.compactModeDescription', 'Reduce spacing between elements')}
          </p>
        </div>
        <Switch className="focus-enhanced" />
      </div>
    </SettingsSection>
  );
};
