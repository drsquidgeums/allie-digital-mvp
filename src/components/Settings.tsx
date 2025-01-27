import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LanguageSettings } from "./settings/LanguageSettings";
import { AccessibilitySettings } from "./settings/AccessibilitySettings";
import { NotificationSettings } from "./settings/NotificationSettings";
import { PerformanceSettings } from "./settings/PerformanceSettings";
import { DisplaySettings } from "./settings/DisplaySettings";
import { PrivacySettings } from "./settings/PrivacySettings";
import { KeyboardSettings } from "./settings/KeyboardSettings";
import { StorageSettings } from "./settings/StorageSettings";
import { IntegrationSettings } from "./settings/IntegrationSettings";

export const Settings = () => {
  return (
    <Card 
      className="h-full bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative border-none shadow-lg ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      role="region"
      aria-label="Application Settings"
    >
      <div className="p-6 space-y-4 max-w-4xl mx-auto">
        <p className="text-muted-foreground">Manage your application preferences</p>
        <Separator />
        <div className="space-y-6">
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
    </Card>
  );
};