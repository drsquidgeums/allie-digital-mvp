
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SettingsSection } from "./SettingsSection";

export const DisplaySettings = () => {
  return (
    <SettingsSection title="Display">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Compact Mode</Label>
          <p className="text-sm text-muted-foreground">Reduce spacing between elements</p>
        </div>
        <Switch />
      </div>
    </SettingsSection>
  );
};
