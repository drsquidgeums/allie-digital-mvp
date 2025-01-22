import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SettingsSection } from "./SettingsSection";

export const DisplaySettings = () => {
  return (
    <SettingsSection title="Display">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Reduced Motion</Label>
          <p className="text-sm text-muted-foreground">Minimize animations for accessibility</p>
        </div>
        <Switch />
      </div>

      <div className="space-y-2">
        <Label>Zoom Level</Label>
        <Select defaultValue="100">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select zoom level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="80">80%</SelectItem>
            <SelectItem value="90">90%</SelectItem>
            <SelectItem value="100">100%</SelectItem>
            <SelectItem value="110">110%</SelectItem>
            <SelectItem value="120">120%</SelectItem>
          </SelectContent>
        </Select>
      </div>

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