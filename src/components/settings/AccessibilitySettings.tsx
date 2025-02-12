
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { globalContrastState } from "@/utils/contrastStateManager";
import { useToast } from "@/hooks/use-toast";

export const AccessibilitySettings = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isHighContrast, setIsHighContrast] = useState(globalContrastState.isHighContrast);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  useEffect(() => {
    const unsubscribe = globalContrastState.subscribe((value) => {
      setIsHighContrast(value);
    });
    return () => unsubscribe();
  }, []);

  const handleContrastChange = (checked: boolean) => {
    globalContrastState.setHighContrast(checked);
    toast({
      title: checked ? "High contrast mode enabled" : "High contrast mode disabled",
      description: checked ? "Enhanced visibility settings applied" : "Default visibility settings restored",
    });
  };

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
            onCheckedChange={setIsScreenReaderEnabled}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t('settings.accessibility.contrast', 'High Contrast Mode')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('settings.accessibility.contrastDescription', 'Increase contrast for better visibility')}
            </p>
          </div>
          <Switch 
            checked={isHighContrast}
            onCheckedChange={handleContrastChange}
          />
        </div>
      </div>
      <Separator />
    </div>
  );
};
