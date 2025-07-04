
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Focus, Shield, Clock, Volume2, Bell, Globe } from "lucide-react";
import { useFocusModeControl } from "@/hooks/focus/useFocusModeControl";
import { useFocusSettings } from "@/hooks/useFocusSettings";
import { useFocusModeEffects } from "./useFocusModeEffects";

export const EnhancedFocusMode = () => {
  const { settings, updateSetting } = useFocusSettings();
  const { isActive, toggleFocusMode } = useFocusModeControl(settings);
  
  // Apply focus mode effects
  useFocusModeEffects(isActive, settings);

  const focusFeatures = [
    {
      key: 'blockNotifications' as const,
      label: 'Block Notifications',
      description: 'Prevent pop-up notifications during focus sessions',
      icon: Bell
    },
    {
      key: 'blockPopups' as const,
      label: 'Block Popups',
      description: 'Block intrusive popups and alerts',
      icon: Shield
    },
    {
      key: 'blockSocialMedia' as const,
      label: 'Block Social Media',
      description: 'Hide social media elements on pages',
      icon: Globe
    },
    {
      key: 'muteAudio' as const,
      label: 'Mute Audio',
      description: 'Mute non-essential audio during focus',
      icon: Volume2
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Focus className="h-5 w-5" />
            Enhanced Focus Mode
          </div>
          {isActive && (
            <Badge variant="destructive" className="animate-pulse">
              Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Focus Toggle */}
        <div className="space-y-4">
          <Button
            onClick={toggleFocusMode}
            variant={isActive ? "destructive" : "default"}
            size="lg"
            className="w-full"
          >
            <Focus className="h-4 w-4 mr-2" />
            {isActive ? "Exit Focus Mode" : "Enter Focus Mode"}
          </Button>
          
          {isActive && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd> to exit focus mode
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Focus Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Focus Settings</h4>
          <div className="space-y-4">
            {focusFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label htmlFor={feature.key} className="text-sm font-medium">
                        {feature.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={feature.key}
                    checked={settings[feature.key]}
                    onCheckedChange={(checked) => updateSetting(feature.key, checked)}
                    disabled={isActive}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Quick Tips */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Quick Tips</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Focus mode enters fullscreen for maximum immersion</li>
            <li>• Combine with Pomodoro timer for structured study sessions</li>
            <li>• Customize settings before activating focus mode</li>
            <li>• Use break reminders to maintain healthy study habits</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
