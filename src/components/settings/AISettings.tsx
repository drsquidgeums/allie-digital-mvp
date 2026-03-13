import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Key, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { useAIUsage } from "@/hooks/useAIUsage";

export const AISettings = () => {
  const { usage, remaining, isLoading, saveApiKey, deleteApiKey } = useAIUsage();
  const [openaiKey, setOpenaiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleSave = async () => {
    if (!openaiKey.trim()) return;
    const success = await saveApiKey("openai", openaiKey);
    if (success) setOpenaiKey("");
  };

  const usagePercent = usage ? (usage.used / usage.limit) * 100 : 0;
  const hasOpenAIKey = usage?.providers?.includes("openai");

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">AI Settings</h2>
      </div>

      {/* Usage Section */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Monthly AI Credits</Label>
            {hasOpenAIKey ? (
              <Badge variant="secondary" className="text-xs">Unlimited (Own Key)</Badge>
            ) : (
              <span className="text-sm text-muted-foreground">
                {usage ? `${usage.used} / ${usage.limit} used` : "Loading..."}
              </span>
            )}
          </div>
          {!hasOpenAIKey && (
            <>
              <Progress value={Math.min(usagePercent, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {remaining !== null && remaining > 0
                  ? `${remaining} AI uses remaining this month. Resets on the 1st.`
                  : remaining === 0
                  ? "Credits used up. Add your own API key below for unlimited access."
                  : ""}
              </p>
            </>
          )}
        </div>

        {/* BYOK Section */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-2 mb-2">
            <Key className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Your Own API Key (Optional)</Label>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Add your own OpenAI API key for unlimited AI access. Your key is stored securely and never shared.
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline ml-1"
            >
              Get a key <ExternalLink className="h-3 w-3" />
            </a>
          </p>

          {hasOpenAIKey ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 rounded-md border border-border bg-muted text-sm text-muted-foreground">
                sk-••••••••••••••••
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteApiKey("openai")}
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
                  placeholder="sk-..."
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
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
              <Button onClick={handleSave} disabled={isLoading || !openaiKey.trim()}>
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
