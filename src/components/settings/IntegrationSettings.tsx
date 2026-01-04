import React from "react";
import { useTranslation } from "react-i18next";

export const IntegrationSettings = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('settings.integrations.title', 'Integrations')}</h3>
      <p className="text-sm text-muted-foreground">
        {t('settings.integrations.comingSoon', 'Integrations with external services are coming soon. Stay tuned for updates!')}
      </p>
    </div>
  );
};
