import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const AccessibilitySettings = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Accessibility</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Screen Reader Support</Label>
            <p className="text-sm text-muted-foreground">Enable enhanced screen reader compatibility</p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>High Contrast Mode</Label>
            <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
          </div>
          <Switch />
        </div>
      </div>
      <Separator />
    </div>
  );
};