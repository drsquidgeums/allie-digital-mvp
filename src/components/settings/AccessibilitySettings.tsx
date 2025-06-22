
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
  const [isHighContrastEnabled, setIsHighContrastEnabled] = useState(false);
  const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState(false);

  const handleScreenReaderToggle = (checked: boolean) => {
    setIsScreenReaderEnabled(checked);
    // Apply screen reader optimizations to the document
    document.documentElement.setAttribute('data-screen-reader', checked.toString());
    toast({
      title: t('settings.accessibility.screenReader'),
      description: checked 
        ? t('settings.accessibility.screenReaderEnabled', 'Screen reader support enabled')
        : t('settings.accessibility.screenReaderDisabled', 'Screen reader support disabled')
    });
  };

  const handleHighContrastToggle = (checked: boolean) => {
    setIsHighContrastEnabled(checked);
    // Apply high contrast mode
    document.documentElement.setAttribute('data-high-contrast', checked.toString());
    toast({
      title: t('settings.accessibility.highContrast', 'High Contrast'),
      description: checked 
        ? t('settings.accessibility.highContrastEnabled', 'High contrast mode enabled')
        : t('settings.accessibility.highContrastDisabled', 'High contrast mode disabled')
    });
  };

  const handleReducedMotionToggle = (checked: boolean) => {
    setIsReducedMotionEnabled(checked);
    // Apply reduced motion preferences
    document.documentElement.setAttribute('data-reduced-motion', checked.toString());
    toast({
      title: t('settings.accessibility.reducedMotion', 'Reduced Motion'),
      description: checked 
        ? t('settings.accessibility.reducedMotionEnabled', 'Reduced motion enabled')
        : t('settings.accessibility.reducedMotionDisabled', 'Reduced motion disabled')
    });
  };

  return (
    <div className="space-y-6" role="region" aria-labelledby="accessibility-settings-title">
      <h3 id="accessibility-settings-title" className="text-lg font-medium">
        {t('settings.accessibility.title', 'Accessibility')}
      </h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between" role="group" aria-labelledby="screen-reader-label">
          <div className="space-y-1">
            <Label id="screen-reader-label" className="text-base font-medium">
              {t('settings.accessibility.screenReader', 'Screen Reader Support')}
            </Label>
            <p className="text-sm text-muted-foreground" id="screen-reader-desc">
              {t('settings.accessibility.screenReaderDescription', 'Enable enhanced screen reader compatibility and announcements')}
            </p>
          </div>
          <Switch 
            checked={isScreenReaderEnabled}
            onCheckedChange={handleScreenReaderToggle}
            aria-labelledby="screen-reader-label"
            aria-describedby="screen-reader-desc"
            role="switch"
          />
        </div>

        <div className="flex items-center justify-between" role="group" aria-labelledby="high-contrast-label">
          <div className="space-y-1">
            <Label id="high-contrast-label" className="text-base font-medium">
              {t('settings.accessibility.highContrast', 'High Contrast Mode')}
            </Label>
            <p className="text-sm text-muted-foreground" id="high-contrast-desc">
              {t('settings.accessibility.highContrastDescription', 'Increase color contrast for better visibility')}
            </p>
          </div>
          <Switch 
            checked={isHighContrastEnabled}
            onCheckedChange={handleHighContrastToggle}
            aria-labelledby="high-contrast-label"
            aria-describedby="high-contrast-desc"
            role="switch"
          />
        </div>

        <div className="flex items-center justify-between" role="group" aria-labelledby="reduced-motion-label">
          <div className="space-y-1">
            <Label id="reduced-motion-label" className="text-base font-medium">
              {t('settings.accessibility.reducedMotion', 'Reduced Motion')}
            </Label>
            <p className="text-sm text-muted-foreground" id="reduced-motion-desc">
              {t('settings.accessibility.reducedMotionDescription', 'Minimize animations and transitions')}
            </p>
          </div>
          <Switch 
            checked={isReducedMotionEnabled}
            onCheckedChange={handleReducedMotionToggle}
            aria-labelledby="reduced-motion-label"
            aria-describedby="reduced-motion-desc"
            role="switch"
          />
        </div>
      </div>
      
      <Separator />
    </div>
  );
};
