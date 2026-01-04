
import React from "react";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

export const NotificationSettings = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('settings.notifications.title', 'Notifications')}</h3>
      <p className="text-sm text-muted-foreground">
        {t('settings.notifications.comingSoon', 'Notification settings are coming soon. Stay tuned for updates!')}
      </p>
      <Separator />
    </div>
  );
};
