
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FocusSettingSwitchProps {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const FocusSettingSwitch = ({
  label,
  description,
  checked,
  onCheckedChange,
}: FocusSettingSwitchProps) => {
  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="space-y-0.5">
        <Label className="text-sm">{label}</Label>
        <div className="text-xs text-muted-foreground">
          {description}
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
};
