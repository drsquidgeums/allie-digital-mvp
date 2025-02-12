
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const PerformanceSettings = () => {
  return (
    <div className="space-y-4 card-material p-6">
      <h3 className="text-lg font-medium text-foreground">Performance</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-foreground">Auto-save</Label>
            <p className="text-sm text-muted-foreground">Automatically save changes</p>
          </div>
          <Switch className="data-[state=checked]:bg-primary" />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-foreground">Hardware Acceleration</Label>
            <p className="text-sm text-muted-foreground">Use GPU for better performance</p>
          </div>
          <Switch className="data-[state=checked]:bg-primary" />
        </div>
      </div>
      <Separator className="bg-border/50" />
    </div>
  );
};
