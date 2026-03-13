import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Key, Trash2, Eye, EyeOff, ExternalLink, Brain, Mic } from "lucide-react";
import { useAIUsage, ProviderUsage } from "@/hooks/useAIUsage";

const providerMeta: Record<string, { label: string; icon: React.ElementType; keyPrefix: string; keyUrl: string; color: string }> = {
  openai: {
    label: "OpenAI",
    icon: Sparkles,
    keyPrefix: "sk-",
    keyUrl: "https://platform.openai.com/api-keys",
    color: "text-emerald-500",
  },
  anthropic: {
    label: "Anthropic",
    icon: Brain,
    keyPrefix: "sk-ant-",
    keyUrl: "https://console.anthropic.com/settings/keys",
    color: "text-orange-500",
  },
  elevenlabs: {
    label: "ElevenLabs",
    icon: Mic,
    keyPrefix: "",
    keyUrl: "https://elevenlabs.io/app/settings/api-keys",
    color: "text-violet-500",
  },
};

const ProviderKeyInput = ({
  providerName,
  hasKey,
  isLoading,
  onSave,
  onDelete,
}: {
  providerName: string;
  hasKey: boolean;
  isLoading: boolean;
  onSave: (provider: string, key: string) => Promise<boolean>;
  onDelete: (provider: string) => Promise<void>;
}) => {
  const [keyValue, setKeyValue] = useState("");
  const [showKey, setShowKey] = useState(false);
  const meta = providerMeta[providerName];
  if (!meta) return null;

  const Icon = meta.icon;

  const handleSave = async () => {
    if (!keyValue.trim()) return;
    const success = await onSave(providerName, keyValue);
    if (success) setKeyValue("");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${meta.color}`} />
        <Label className="text-sm font-medium">{meta.label}</Label>
        {hasKey && (
          <Badge variant="secondary" className="text-[10px] ml-auto">Own Key Active</Badge>
        )}
      </div>

      {hasKey ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 rounded-md border border-border bg-muted text-sm text-muted-foreground">
            {meta.keyPrefix}••••••••••••
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(providerName)}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type={showKey ? "text" : "password"}
              placeholder={meta.keyPrefix ? `${meta.keyPrefix}...` : "Enter API key..."}
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <Button onClick={handleSave} disabled={isLoading || !keyValue.trim()}>
            Save
          </Button>
        </div>
      )}
      <a
        href={meta.keyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
      >
        Get a {meta.label} key <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
};

const ProviderUsageBar = ({ provider }: { provider: ProviderUsage }) => {
  const meta = providerMeta[provider.name];
  if (!meta) return null;
  const Icon = meta.icon;
  const percent = provider.hasOwnKey ? 0 : Math.min((provider.used / provider.limit) * 100, 100);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${meta.color}`} />
          <span className="text-sm font-medium">{meta.label}</span>
        </div>
        {provider.hasOwnKey ? (
          <Badge variant="secondary" className="text-xs">Unlimited</Badge>
        ) : (
          <span className="text-sm text-muted-foreground">
            {provider.used} / {provider.limit} used
          </span>
        )}
      </div>
      {!provider.hasOwnKey && (
        <>
          <Progress value={percent} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {provider.remaining > 0
              ? `${provider.remaining} uses remaining this month`
              : "Credits used up. Add your own key below for unlimited access."}
          </p>
        </>
      )}
    </div>
  );
};

export const AISettings = () => {
  const { usage, isLoading, saveApiKey, deleteApiKey } = useAIUsage();

  const ownKeyProviders = usage?.providers ?? [];

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">AI Settings</h2>
      </div>

      {/* Per-provider usage */}
      <div className="space-y-4 mb-6">
        <Label className="text-sm font-medium">Monthly AI Credits</Label>
        {usage?.byProvider ? (
          <div className="space-y-4">
            {usage.byProvider.map((p) => (
              <ProviderUsageBar key={p.name} provider={p} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Loading...</p>
        )}
      </div>

      {/* BYOK Section */}
      <div className="border-t border-border pt-4 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Key className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Your Own API Keys (Optional)</Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Add your own API keys for unlimited access. Keys are stored securely and never shared.
        </p>

        {Object.keys(providerMeta).map((provName) => (
          <ProviderKeyInput
            key={provName}
            providerName={provName}
            hasKey={ownKeyProviders.includes(provName)}
            isLoading={isLoading}
            onSave={saveApiKey}
            onDelete={deleteApiKey}
          />
        ))}
      </div>
    </Card>
  );
};
