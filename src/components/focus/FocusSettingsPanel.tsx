
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useFocusSettings } from "@/hooks/useFocusSettings";
import { Bell, BellOff, TimerOff, Eye, EyeOff } from "lucide-react";

export const FocusSettingsPanel: React.FC = () => {
  const { settings, updateSetting } = useFocusSettings();
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Customize Focus Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BellOff className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="block-notifications" className="flex-1">
                Block notifications
              </Label>
            </div>
            <Switch
              id="block-notifications"
              checked={settings.blockNotifications}
              onCheckedChange={(checked) => updateSetting('blockNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <EyeOff className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="block-popups" className="flex-1">
                Block popups
              </Label>
            </div>
            <Switch
              id="block-popups"
              checked={settings.blockPopups}
              onCheckedChange={(checked) => updateSetting('blockPopups', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BellOff className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="block-social" className="flex-1">
                Block social media
              </Label>
            </div>
            <Switch
              id="block-social"
              checked={settings.blockSocialMedia}
              onCheckedChange={(checked) => updateSetting('blockSocialMedia', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BellOff className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="mute-audio" className="flex-1">
                Mute audio
              </Label>
            </div>
            <Switch
              id="mute-audio"
              checked={settings.muteAudio}
              onCheckedChange={(checked) => updateSetting('muteAudio', checked)}
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BellOff className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="block-emails" className="flex-1">
                Block email notifications
              </Label>
            </div>
            <Switch
              id="block-emails"
              checked={settings.blockEmails}
              onCheckedChange={(checked) => updateSetting('blockEmails', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BellOff className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="block-messaging" className="flex-1">
                Block messaging apps
              </Label>
            </div>
            <Switch
              id="block-messaging"
              checked={settings.blockMessaging}
              onCheckedChange={(checked) => updateSetting('blockMessaging', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <EyeOff className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="minimize-distraction" className="flex-1">
                Minimize distractions (UI)
              </Label>
            </div>
            <Switch
              id="minimize-distraction"
              checked={settings.minimizeDistraction}
              onCheckedChange={(checked) => updateSetting('minimizeDistraction', checked)}
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TimerOff className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="auto-breaks" className="flex-1">
                  Auto breaks
                </Label>
              </div>
              <Switch
                id="auto-breaks"
                checked={settings.autoBreaks}
                onCheckedChange={(checked) => updateSetting('autoBreaks', checked)}
              />
            </div>
            
            {settings.autoBreaks && (
              <div className="pt-2 px-2">
                <Label className="mb-2 block">
                  Focus duration: {settings.focusDuration} minutes
                </Label>
                <Slider 
                  min={5} 
                  max={120} 
                  step={5}
                  value={[settings.focusDuration]}
                  onValueChange={(value) => updateSetting('focusDuration', value[0])}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
