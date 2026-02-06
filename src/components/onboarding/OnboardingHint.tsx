import React, { useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface OnboardingHintProps {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  showPulse?: boolean;
}

export const OnboardingHint: React.FC<OnboardingHintProps> = ({
  id,
  title,
  description,
  children,
  placement = "bottom",
  showPulse = true
}) => {
  const { hintsEnabled, dismissedHints, dismissHint, onboardingEnabled } = useOnboarding();
  const [isOpen, setIsOpen] = useState(false);

  const isDismissed = dismissedHints.includes(id);
  const shouldShow = onboardingEnabled && hintsEnabled && !isDismissed;

  const handleDismiss = () => {
    dismissHint(id);
    setIsOpen(false);
  };

  if (!shouldShow) {
    return <>{children}</>;
  }

  return (
    <div className="relative inline-block">
      {children}
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "absolute -top-1 -right-1 z-10",
              "flex items-center justify-center",
              "w-5 h-5 rounded-full",
              "bg-primary text-primary-foreground",
              "shadow-md cursor-pointer",
              showPulse && "animate-pulse"
            )}
            aria-label="Show hint"
          >
            <HelpCircle className="h-3 w-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          side={placement} 
          className="w-64 p-3"
          sideOffset={8}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-medium text-sm mb-1">{title}</h4>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 shrink-0"
              onClick={handleDismiss}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto mt-2 text-xs"
            onClick={handleDismiss}
          >
            Got it, don't show again
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
