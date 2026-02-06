import React from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { RotateCcw, Play, Sparkles, ListChecks } from "lucide-react";

export const OnboardingSettings: React.FC = () => {
  const { t } = useTranslation();
  const {
    onboardingEnabled,
    setOnboardingEnabled,
    startTour,
    resetOnboarding,
    hasCompletedOnboarding
  } = useOnboarding();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Sparkles className="h-5 w-5" />
        {t('settings.onboarding.title', 'Onboarding & Tutorials')}
      </h3>
      <p className="text-sm text-muted-foreground">
        {t('settings.onboarding.description', 'Control onboarding features to help you learn how to use Allie.')}
      </p>
      
      <div className="space-y-4">
        {/* Master toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="onboarding-enabled" className="text-sm font-medium">
              {t('settings.onboarding.enableOnboarding', 'Enable Onboarding')}
            </Label>
            <p className="text-xs text-muted-foreground">
              {t('settings.onboarding.enableOnboardingDesc', 'Show welcome screen and tutorial options')}
            </p>
          </div>
          <Switch
            id="onboarding-enabled"
            checked={onboardingEnabled}
            onCheckedChange={setOnboardingEnabled}
          />
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={startTour}
            disabled={!onboardingEnabled}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            {t('settings.onboarding.startTour', 'Start Tour')}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetOnboarding}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {t('settings.onboarding.resetOnboarding', 'Reset Onboarding')}
          </Button>
        </div>

        {hasCompletedOnboarding && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <ListChecks className="h-3 w-3" />
            {t('settings.onboarding.tourCompleted', 'You\'ve completed the tour!')}
          </p>
        )}
      </div>

      <Separator />
    </div>
  );
};
