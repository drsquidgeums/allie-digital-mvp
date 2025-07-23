
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Volume2, Eye, Bell, Users, Timer } from "lucide-react";

interface CommunityPreferencesProps {
  onPreferencesChange: (preferences: any) => void;
}

export const CommunityPreferences = ({ onPreferencesChange }: CommunityPreferencesProps) => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    communicationStyle: "text",
    notificationLevel: "minimal",
    visualLayout: "simple",
    socialInteraction: "structured",
    cognitiveSupport: true,
    sensoryReduction: false,
    autoSummaries: true,
    breakReminders: true
  });

  const handlePreferenceChange = (key: string, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    onPreferencesChange(newPreferences);
    
    toast({
      title: "Preferences Updated",
      description: "Your community preferences have been saved"
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Users className="h-5 w-5" />
        Community Accessibility Preferences
      </h3>
      
      <div className="space-y-6">
        {/* Communication Preferences */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Preferred Communication Style
          </Label>
          <Select 
            value={preferences.communicationStyle} 
            onValueChange={(value) => handlePreferenceChange('communicationStyle', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text-only communication</SelectItem>
              <SelectItem value="voice">Voice messages preferred</SelectItem>
              <SelectItem value="mixed">Mixed communication</SelectItem>
              <SelectItem value="structured">Structured templates</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Visual Preferences */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Visual Layout
          </Label>
          <Select 
            value={preferences.visualLayout} 
            onValueChange={(value) => handlePreferenceChange('visualLayout', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">Simple layout with minimal elements</SelectItem>
              <SelectItem value="structured">Highly structured with clear sections</SelectItem>
              <SelectItem value="visual">Visual-heavy with icons and colors</SelectItem>
              <SelectItem value="compact">Compact information display</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Notification Preferences */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notification Level
          </Label>
          <Select 
            value={preferences.notificationLevel} 
            onValueChange={(value) => handlePreferenceChange('notificationLevel', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal">Minimal notifications</SelectItem>
              <SelectItem value="important">Important only</SelectItem>
              <SelectItem value="scheduled">Scheduled batches</SelectItem>
              <SelectItem value="full">All notifications</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Toggle Preferences */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Cognitive Load Reduction</Label>
              <p className="text-sm text-muted-foreground">
                Simplify complex information and provide step-by-step guidance
              </p>
            </div>
            <Switch 
              checked={preferences.cognitiveSupport}
              onCheckedChange={(checked) => handlePreferenceChange('cognitiveSupport', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Sensory Reduction Mode</Label>
              <p className="text-sm text-muted-foreground">
                Reduce animations, sounds, and visual distractions
              </p>
            </div>
            <Switch 
              checked={preferences.sensoryReduction}
              onCheckedChange={(checked) => handlePreferenceChange('sensoryReduction', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Auto-Generate Summaries</Label>
              <p className="text-sm text-muted-foreground">
                Provide brief summaries of long discussions and content
              </p>
            </div>
            <Switch 
              checked={preferences.autoSummaries}
              onCheckedChange={(checked) => handlePreferenceChange('autoSummaries', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Break Reminders
              </Label>
              <p className="text-sm text-muted-foreground">
                Gentle reminders to take breaks during extended community use
              </p>
            </div>
            <Switch 
              checked={preferences.breakReminders}
              onCheckedChange={(checked) => handlePreferenceChange('breakReminders', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
