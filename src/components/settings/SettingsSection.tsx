import React from "react";
import { Separator } from "@/components/ui/separator";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SettingsSection = ({ title, children }: SettingsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="space-y-6">
        {children}
      </div>
      <Separator />
    </div>
  );
};