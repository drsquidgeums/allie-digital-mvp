
import React from "react";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

export const KeyboardSettings = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('settings.keyboard.title', 'Keyboard Shortcuts')}</h3>
      <p className="text-sm text-muted-foreground">
        {t('settings.keyboard.comingSoon', 'Custom keyboard shortcut configuration is coming soon.')}
      </p>
      <Separator />
    </div>
  );
};
