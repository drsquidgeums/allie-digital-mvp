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
import { OnboardingSettings } from "./onboarding/OnboardingSettings";
import { useTranslation } from "react-i18next";

export const Settings = () => {
  const { t } = useTranslation();
  
  return (
    <div 
      className="p-6 h-full overflow-auto bg-card text-card-foreground animate-fade-in"
      role="region"
      aria-label={t('settings.title')}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{t('settings.title')}</h1>
        <p className="text-muted-foreground">{t('settings.description')}</p>
      </div>
      <Separator className="mb-6" />
      <div className="space-y-6">
        <AccountSettings />
        <LanguageSettings />
        <OnboardingSettings />
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
  );
};
