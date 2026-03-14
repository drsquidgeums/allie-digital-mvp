import React from "react";
import { Sparkles, Brain, Mic } from "lucide-react";
import { useAIUsage, ProviderUsage } from "@/hooks/useAIUsage";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

const providerConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  openai: { label: "OpenAI", icon: Sparkles, color: "text-emerald-500" },
  anthropic: { label: "Anthropic", icon: Brain, color: "text-orange-500" },
  elevenlabs: { label: "ElevenLabs", icon: Mic, color: "text-violet-500" },
};

const CreditBar = ({ provider }: { provider: ProviderUsage }) => {
  const config = providerConfig[provider.name];
  if (!config) return null;

  const Icon = config.icon;
  const percent = provider.hasOwnKey ? 100 : Math.max(0, (provider.remaining / provider.limit) * 100);
  const isLow = !provider.hasOwnKey && provider.remaining <= 3;
  const isExhausted = !provider.hasOwnKey && provider.remaining === 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 w-full">
            <Icon className={`h-3.5 w-3.5 shrink-0 ${isExhausted ? "text-destructive" : config.color}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-medium text-muted-foreground truncate">
                  {config.label}
                </span>
                <span className={`text-[10px] tabular-nums font-semibold ${
                  isExhausted ? "text-destructive" : isLow ? "text-yellow-500" : "text-foreground"
                }`}>
                  {provider.hasOwnKey ? "∞" : `${provider.remaining}/${provider.limit}`}
                </span>
              </div>
              <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    provider.hasOwnKey
                      ? "bg-primary"
                      : isExhausted
                      ? "bg-destructive"
                      : isLow
                      ? "bg-yellow-500"
                      : "bg-primary"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[200px]">
          <p className="text-xs">
            {provider.hasOwnKey
              ? `Unlimited — using your own ${config.label} key`
              : `${provider.remaining} of ${provider.limit} ${config.label} credits left this month`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const SidebarAICredits = () => {
  const { usage } = useAIUsage();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Show placeholder with 0 values when no usage data (e.g. admin/edit mode)
  const providers: ProviderUsage[] = usage?.byProvider ?? [
    { name: "openai", used: 0, limit: 15, remaining: 0, hasOwnKey: false },
    { name: "anthropic", used: 0, limit: 15, remaining: 0, hasOwnKey: false },
    { name: "elevenlabs", used: 0, limit: 10, remaining: 0, hasOwnKey: false },
  ];

  return (
    <button
      onClick={() => navigate("/settings")}
      className="w-full rounded-lg border border-border bg-card/50 p-2.5 space-y-2 hover:bg-accent/50 transition-colors text-left"
      aria-label="AI Credits — click to manage in Settings"
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-semibold text-foreground">AI Credits</span>
      </div>
      {providers.map((p) => (
        <CreditBar key={p.name} provider={p} />
      ))}
    </button>
  );
};
