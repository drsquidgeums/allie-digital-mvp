import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const PrivacySettings = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Privacy & Security</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Data Collection</Label>
            <p className="text-sm text-muted-foreground">Allow anonymous usage data collection</p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Two-Factor Authentication</Label>
            <p className="text-sm text-muted-foreground">Enable 2FA for additional security</p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Session Timeout</Label>
            <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
          </div>
          <Switch />
        </div>
      </div>
      <Separator />
    </div>
  );
};