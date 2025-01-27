import React from "react";
import { Label } from "@/components/ui/label";
import { IntegrationButton } from "./IntegrationButton";

interface IntegrationItemProps {
  title: string;
  description: string;
  isLoading?: boolean;
  onClick?: () => void;
}

export const IntegrationItem = ({
  title,
  description,
  isLoading,
  onClick,
}: IntegrationItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label>{title}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <IntegrationButton 
        label="Connect" 
        isLoading={isLoading} 
        onClick={onClick}
      />
    </div>
  );
};