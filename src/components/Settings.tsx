import React from "react";
import { Separator } from "@/components/ui/separator";
import { LanguageSettings } from "./settings/LanguageSettings";
import { AccessibilitySettings } from "./settings/AccessibilitySettings";
import { NotificationSettings } from "./settings/NotificationSettings";
import { PerformanceSettings } from "./settings/PerformanceSettings";

export const Settings = () => {
  return (
    <div className="flex-1 bg-background animate-fade-in">
      <div className="container mx-auto py-4 px-4">
        <div className="max-w-4xl mx-auto space-y-6 pb-6">
          <div className="p-6 space-y-6">
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
        </div>
      </div>
    </div>
  );
};