
import React from "react";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

export const DisplaySettings = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('settings.display.title', 'Display')}</h3>
      <p className="text-sm text-muted-foreground">
        {t('settings.display.comingSoon', 'Display customization options are coming soon.')}
      </p>
      <Separator />
    </div>
  );
};
