import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LanguageSettings } from "./settings/LanguageSettings";
import { AccessibilitySettings } from "./settings/AccessibilitySettings";
import { NotificationSettings } from "./settings/NotificationSettings";
import { PerformanceSettings } from "./settings/PerformanceSettings";

export const Settings = () => {
  return (
    <Card 
      className="h-full bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative border-none shadow-lg ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      role="region"
      aria-label="Application Settings"
    >
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Application Settings</h2>
          <p className="text-muted-foreground">Manage your application preferences</p>
        </div>
        
        <Separator />

        <div className="space-y-6">
          <LanguageSettings />
          <AccessibilitySettings />
          <NotificationSettings />
          <PerformanceSettings />
        </div>
      </div>
    </Card>
  );
};