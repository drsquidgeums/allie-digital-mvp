
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";

export const AccessibilitySettings = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('settings.accessibility.title', 'Accessibility')}</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t('settings.accessibility.screenReader', 'Screen Reader Support')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('settings.accessibility.screenReaderDescription', 'Enable enhanced screen reader compatibility')}
            </p>
          </div>
          <Switch 
            checked={isScreenReaderEnabled}
            onCheckedChange={(checked) => {
              setIsScreenReaderEnabled(checked);
              toast({
                title: t('settings.accessibility.screenReader'),
                description: checked 
                  ? t('settings.accessibility.screenReaderEnabled', 'Screen reader support enabled')
                  : t('settings.accessibility.screenReaderDisabled', 'Screen reader support disabled')
              });
            }}
          />
        </div>
      </div>
      <Separator />
    </div>
  );
};
