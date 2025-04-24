import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const NotificationSettings = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Notifications</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Task Reminders</Label>
            <p className="text-sm text-muted-foreground">Receive notifications for upcoming tasks</p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Focus Timer Alerts</Label>
            <p className="text-sm text-muted-foreground">Get notified when focus sessions end</p>
          </div>
          <Switch />
        </div>
      </div>
      <Separator />
    </div>
  );
};