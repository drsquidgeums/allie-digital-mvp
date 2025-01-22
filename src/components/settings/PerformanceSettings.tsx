import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

export const PerformanceSettings = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Performance</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Animations</Label>
            <p className="text-sm text-muted-foreground">Enable interface animations</p>
          </div>
          <Switch />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Animation Speed</Label>
            <span className="text-sm text-muted-foreground">1x</span>
          </div>
          <Slider
            defaultValue={[1]}
            max={2}
            min={0.5}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto-save</Label>
            <p className="text-sm text-muted-foreground">Automatically save changes</p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Hardware Acceleration</Label>
            <p className="text-sm text-muted-foreground">Use GPU for better performance</p>
          </div>
          <Switch />
        </div>
      </div>
      <Separator />
    </div>
  );
};