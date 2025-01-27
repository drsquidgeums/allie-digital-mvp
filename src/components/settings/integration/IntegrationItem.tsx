import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface IntegrationItemProps {
  title: string;
  description: string;
  onClick?: () => void;
  isLoading?: boolean;
}

export const IntegrationItem = ({
  title,
  description,
  onClick,
  isLoading,
}: IntegrationItemProps) => {
  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="space-y-0.5">
        <Label>{title}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button
        variant="outline"
        onClick={onClick}
        disabled={isLoading}
        className="min-w-[100px]"
      >
        {isLoading ? "Connecting..." : "Connect"}
      </Button>
    </div>
  );
};