import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const PerformanceSettings = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Performance</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Animations</Label>
            <p className="text-sm text-muted-foreground">Enable interface animations</p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto-save</Label>
            <p className="text-sm text-muted-foreground">Automatically save changes</p>
          </div>
          <Switch />
        </div>
      </div>
      <Separator />
    </div>
  );
};