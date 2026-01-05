
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { useSecurityContext } from "@/components/security/SecurityProvider";

export const PrivacySettings = () => {
  const { t } = useTranslation();
  const { 
    enableAntiScreenCapture,
    toggleAntiScreenCapture 
  } = useSecurityContext();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('settings.privacy.title', 'Privacy & Security')}</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t('settings.privacy.antiScreenshot', 'Anti-Screenshot Protection')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.privacy.antiScreenshotDescription', 'Block attempts to capture screen content')}</p>
          </div>
          <Switch checked={enableAntiScreenCapture} onCheckedChange={toggleAntiScreenCapture} />
        </div>
      </div>
      <Separator />
    </div>
  );
};
