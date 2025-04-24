
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

export const NotificationSettings = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('settings.notifications.title', 'Notifications')}</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t('settings.notifications.taskReminders', 'Task Reminders')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('settings.notifications.taskRemindersDescription', 'Receive notifications for upcoming tasks')}
            </p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t('settings.notifications.focusTimerAlerts', 'Focus Timer Alerts')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('settings.notifications.focusTimerAlertsDescription', 'Get notified when focus sessions end')}
            </p>
          </div>
          <Switch />
        </div>
      </div>
      <Separator />
    </div>
  );
};
