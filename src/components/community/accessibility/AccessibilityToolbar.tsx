
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Eye, Volume2, MousePointer, Palette, Type } from "lucide-react";

export const AccessibilityToolbar = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    highContrast: false,
    reducedMotion: false,
    textSize: [100],
    focusIndicators: true,
    screenReaderMode: false,
    colorBlindFriendly: false
  });

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Apply settings to document
    if (key === 'highContrast') {
      document.documentElement.classList.toggle('high-contrast', value);
    }
    if (key === 'reducedMotion') {
      document.documentElement.classList.toggle('reduce-motion', value);
    }
    if (key === 'textSize') {
      document.documentElement.style.fontSize = `${value[0]}%`;
    }
    
    toast({
      title: "Accessibility Updated",
      description: "Your accessibility preferences have been applied"
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="h-4 w-4" />
          Accessibility
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 z-50 dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]" 
        side="bottom" 
        align="end"
      >
        <Card className="border-none shadow-none">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Palette className="h-3 w-3" />
                  High Contrast Mode
                </Label>
                <p className="text-xs text-muted-foreground">
                  Increase contrast for better visibility
                </p>
              </div>
              <Switch 
                checked={settings.highContrast}
                onCheckedChange={(checked) => handleSettingChange('highContrast', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Reduced Motion</Label>
                <p className="text-xs text-muted-foreground">
                  Minimize animations and transitions
                </p>
              </div>
              <Switch 
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => handleSettingChange('reducedMotion', checked)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Type className="h-3 w-3" />
                <Label className="text-sm font-medium">Text Size</Label>
                <span className="text-xs text-muted-foreground ml-auto">
                  {settings.textSize[0]}%
                </span>
              </div>
              <Slider
                value={settings.textSize}
                onValueChange={(value) => handleSettingChange('textSize', value)}
                min={80}
                max={150}
                step={10}
                className="w-full"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MousePointer className="h-3 w-3" />
                  Enhanced Focus Indicators
                </Label>
                <p className="text-xs text-muted-foreground">
                  Make keyboard navigation more visible
                </p>
              </div>
              <Switch 
                checked={settings.focusIndicators}
                onCheckedChange={(checked) => handleSettingChange('focusIndicators', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Volume2 className="h-3 w-3" />
                  Screen Reader Mode
                </Label>
                <p className="text-xs text-muted-foreground">
                  Optimize for screen reader users
                </p>
              </div>
              <Switch 
                checked={settings.screenReaderMode}
                onCheckedChange={(checked) => handleSettingChange('screenReaderMode', checked)}
              />
            </div>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
};
