import React from "react";
import { Label } from "@/components/ui/label";
import { IntegrationButton } from "./IntegrationButton";
import { cn } from "@/lib/utils";

interface IntegrationItemProps {
  title: string;
  description: string;
  isLoading?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export const IntegrationItem = ({
  title,
  description,
  isLoading,
  onClick,
  disabled = false,
}: IntegrationItemProps) => {
  return (
    <div className={cn(
      "flex items-center justify-between",
      disabled && "opacity-50 cursor-not-allowed"
    )}>
      <div className="space-y-0.5">
        <Label className={disabled ? "text-muted-foreground" : ""}>{title}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <IntegrationButton 
        label={disabled ? "Coming Soon" : "Connect"}
        isLoading={isLoading} 
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
      />
    </div>
  );
};