
import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AccountSettings } from "./settings/AccountSettings";
import { LanguageSettings } from "./settings/LanguageSettings";
import { AccessibilitySettings } from "./settings/AccessibilitySettings";
import { NotificationSettings } from "./settings/NotificationSettings";
import { PerformanceSettings } from "./settings/PerformanceSettings";
import { DisplaySettings } from "./settings/DisplaySettings";
import { PrivacySettings } from "./settings/PrivacySettings";
import { KeyboardSettings } from "./settings/KeyboardSettings";
import { StorageSettings } from "./settings/StorageSettings";
import { IntegrationSettings } from "./settings/IntegrationSettings";
import { useTranslation } from "react-i18next";

export const Settings = () => {
  const { t } = useTranslation();
  
  return (
    <div 
      className="h-full bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      role="region"
      aria-label={t('settings.title')}
    >
      <div className="p-4 space-y-4">
        <h2 className="text-2xl font-bold">{t('settings.title')}</h2>
        <p className="text-muted-foreground">{t('settings.description')}</p>
        <Separator />
        <div className="space-y-6">
          <AccountSettings />
          <LanguageSettings />
          <AccessibilitySettings />
          <DisplaySettings />
          <NotificationSettings />
          <PerformanceSettings />
          <PrivacySettings />
          <KeyboardSettings />
          <StorageSettings />
          <IntegrationSettings />
        </div>
      </div>
    </div>
  );
};
