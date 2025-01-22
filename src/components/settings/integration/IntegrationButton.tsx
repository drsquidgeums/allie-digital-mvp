import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface IntegrationButtonProps {
  label: string;
  isLoading?: boolean;
  onClick?: () => void;
}

export const IntegrationButton = ({ 
  label, 
  isLoading, 
  onClick 
}: IntegrationButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        label
      )}
    </Button>
  );
};