
import React from "react";
import { Separator } from "@/components/ui/separator";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SettingsSection = ({ title, children }: SettingsSectionProps) => {
  return (
    <div className="section-elevated p-6 space-section">
      <h3 className="section-title">{title}</h3>
      <div className="space-content">
        {children}
      </div>
      <Separator className="divider-soft mt-6" />
    </div>
  );
};
