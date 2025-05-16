
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
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
            <Label>{t('settings.privacy.dataCollection', 'Data Collection')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.privacy.dataCollectionDescription', 'Allow anonymous usage data collection')}</p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t('settings.privacy.twoFactor', 'Two-Factor Authentication')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.privacy.twoFactorDescription', 'Enable 2FA for additional security')}</p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Anti-Screenshot Protection</Label>
            <p className="text-sm text-muted-foreground">Block attempts to capture screen content</p>
          </div>
          <Switch checked={enableAntiScreenCapture} onCheckedChange={toggleAntiScreenCapture} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t('settings.privacy.sessionTimeout', 'Session Timeout')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.privacy.sessionTimeoutDescription', 'Automatically log out after inactivity')}</p>
          </div>
          <Switch />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.privacy.changePassword', 'Change Password')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.privacy.changePasswordDescription', 'Update your account password')}</p>
            </div>
            <Button variant="outline">{t('settings.privacy.changePassword', 'Change Password')}</Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.privacy.changeEmail', 'Change Email')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.privacy.changeEmailDescription', 'Update your email address')}</p>
            </div>
            <Button variant="outline">{t('settings.privacy.changeEmail', 'Change Email')}</Button>
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );
};
