import React from "react";
import { Sparkles } from "lucide-react";
import { useAIUsage } from "@/hooks/useAIUsage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

export const AICreditsIndicator = () => {
  const { usage, remaining } = useAIUsage();
  const navigate = useNavigate();

  if (!usage) return null;

  const hasOwnKey = usage.hasOwnKey;
  const isLow = !hasOwnKey && remaining !== null && remaining <= 5;
  const isExhausted = !hasOwnKey && remaining === 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/settings")}
            className="h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="AI Credits"
          >
            <Sparkles className={`h-4 w-4 ${isExhausted ? "text-destructive" : isLow ? "text-yellow-500" : "text-primary"}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[220px]">
          {hasOwnKey ? (
            <p className="text-xs">Unlimited AI, using your own API key</p>
          ) : isExhausted ? (
            <p className="text-xs">AI credits used up this month. Click to add your own API key in Settings for unlimited access.</p>
          ) : isLow ? (
            <p className="text-xs">{remaining} AI credits left this month. Click to manage in Settings.</p>
          ) : (
            <p className="text-xs">{remaining} of {usage.limit} AI credits remaining. Resets monthly. Click to manage.</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
