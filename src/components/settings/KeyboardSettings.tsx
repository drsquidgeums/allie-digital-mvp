
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { SettingsSection } from "./SettingsSection";

export const KeyboardSettings = () => {
  const { t } = useTranslation();
  
  return (
    <SettingsSection title={t('settings.keyboard.title')}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('settings.keyboard.toggleFocusMode')}</Label>
          <Input defaultValue="Ctrl + F" readOnly />
        </div>
        <div className="space-y-2">
          <Label>{t('settings.keyboard.openSettings')}</Label>
          <Input defaultValue="Ctrl + ," readOnly />
        </div>
        <div className="space-y-2">
          <Label>{t('settings.keyboard.saveDocument')}</Label>
          <Input defaultValue="Ctrl + S" readOnly />
        </div>
        <div className="space-y-2">
          <Label>{t('settings.keyboard.toggleTheme')}</Label>
          <Input defaultValue="Ctrl + T" readOnly />
        </div>
      </div>
    </SettingsSection>
  );
};
