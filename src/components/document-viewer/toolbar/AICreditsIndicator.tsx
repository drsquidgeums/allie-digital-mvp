import React from "react";
import { Sparkles } from "lucide-react";
import { useAIUsage } from "@/hooks/useAIUsage";
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
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors hover:bg-accent"
          >
            <Sparkles className={`h-3.5 w-3.5 ${isExhausted ? "text-destructive" : isLow ? "text-yellow-500" : "text-primary"}`} />
            {hasOwnKey ? (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                ∞
              </Badge>
            ) : (
              <span className={`tabular-nums ${isExhausted ? "text-destructive" : isLow ? "text-yellow-500" : "text-muted-foreground"}`}>
                {remaining ?? "..."}/{usage.limit}
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[220px]">
          {hasOwnKey ? (
            <p className="text-xs">Unlimited AI — using your own API key</p>
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
