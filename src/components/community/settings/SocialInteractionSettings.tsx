
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Users, MessageSquare, Shield, Heart } from "lucide-react";

interface SocialInteractionSettingsProps {
  onSettingsChange: (settings: any) => void;
}

export const SocialInteractionSettings = ({ onSettingsChange }: SocialInteractionSettingsProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    conversationStarters: true,
    socialScripts: true,
    interestBasedMatching: true,
    quietSpaceMode: false,
    peerMentoring: true,
    emojiReactions: true,
    structuredFeedback: true,
    safeSpaceIndicator: true
  });

  const handleSettingChange = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
    
    toast({
      title: "Social Settings Updated",
      description: "Your social interaction preferences have been saved"
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Users className="h-5 w-5" />
        Social Interaction Support
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Conversation Starters
            </Label>
            <p className="text-sm text-muted-foreground">
              Show suggested conversation starters in group chats
            </p>
          </div>
          <Switch 
            checked={settings.conversationStarters}
            onCheckedChange={(checked) => handleSettingChange('conversationStarters', checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base font-medium">Social Scripts</Label>
            <p className="text-sm text-muted-foreground">
              Provide templates for common social interactions
            </p>
          </div>
          <Switch 
            checked={settings.socialScripts}
            onCheckedChange={(checked) => handleSettingChange('socialScripts', checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base font-medium">Interest-Based Matching</Label>
            <p className="text-sm text-muted-foreground">
              Match with study partners based on shared interests
            </p>
          </div>
          <Switch 
            checked={settings.interestBasedMatching}
            onCheckedChange={(checked) => handleSettingChange('interestBasedMatching', checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base font-medium">Quiet Space Mode</Label>
            <p className="text-sm text-muted-foreground">
              Reduce notifications and create a calmer environment
            </p>
          </div>
          <Switch 
            checked={settings.quietSpaceMode}
            onCheckedChange={(checked) => handleSettingChange('quietSpaceMode', checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base font-medium">Emoji Reactions</Label>
            <p className="text-sm text-muted-foreground">
              Enable emoji reactions for non-verbal communication
            </p>
          </div>
          <Switch 
            checked={settings.emojiReactions}
            onCheckedChange={(checked) => handleSettingChange('emojiReactions', checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Safe Space Indicator
            </Label>
            <p className="text-sm text-muted-foreground">
              Show which groups follow neurodivergent-friendly practices
            </p>
          </div>
          <Switch 
            checked={settings.safeSpaceIndicator}
            onCheckedChange={(checked) => handleSettingChange('safeSpaceIndicator', checked)}
          />
        </div>
      </div>
    </div>
  );
};
