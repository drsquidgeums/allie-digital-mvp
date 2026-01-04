
import React from "react";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

export const AccessibilitySettings = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4" role="region" aria-labelledby="accessibility-settings-title">
      <h3 id="accessibility-settings-title" className="text-lg font-medium">
        {t('settings.accessibility.title', 'Accessibility')}
      </h3>
      <p className="text-sm text-muted-foreground">
        {t('settings.accessibility.comingSoon', 'Accessibility settings are coming soon. We are working on features to make the app more accessible for everyone.')}
      </p>
      <Separator />
    </div>
  );
};
