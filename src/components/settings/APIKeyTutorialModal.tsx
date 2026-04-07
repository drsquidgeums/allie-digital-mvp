import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Mic,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Copy,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

interface APIKeyTutorialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TutorialStep {
  title: string;
  content: React.ReactNode;
}

const providerTutorials: {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  tagline: string;
  features: string[];
  steps: TutorialStep[];
}[] = [
  {
    id: "openai",
    label: "OpenAI",
    icon: Sparkles,
    color: "text-emerald-500",
    tagline: "Powers built in AI features like Simplify, Document AI, and Learning Tools",
    features: ["AI Simplify", "Document AI", "Learning Tools (flashcards, quizzes, summaries)"],
    steps: [
      {
        title: "Create an OpenAI account",
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              If you don't already have one, you'll need to create a free OpenAI account.
            </p>
            <a
              href="https://platform.openai.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
            >
              Go to OpenAI sign up <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        ),
      },
      {
        title: "Add billing to your OpenAI account",
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              OpenAI requires a payment method before you can use their API. You only pay for what you use and costs are typically very low (pennies per request).
            </p>
            <a
              href="https://platform.openai.com/account/billing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
            >
              Go to OpenAI billing <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Tip:</span> You can set a monthly spending limit to control costs. Most users spend less than $1 per month.
              </p>
            </div>
          </div>
        ),
      },
      {
        title: "Generate your API key",
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Now create a new secret key that Allie can use to connect to your OpenAI account.
            </p>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Click the link below to go to your API keys page</li>
              <li>Click <span className="font-medium text-foreground">"Create new secret key"</span></li>
              <li>Give it a name like <span className="font-medium text-foreground">"Allie"</span></li>
              <li>Copy the key (it starts with <code className="px-1 py-0.5 rounded bg-muted text-xs">sk-</code>)</li>
            </ol>
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
            >
              Go to OpenAI API keys <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Important:</span> Copy your key immediately. OpenAI will only show it once. If you lose it, you'll need to create a new one.
              </p>
            </div>
          </div>
        ),
      },
      {
        title: "Paste it into Allie",
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Go back to the AI Settings section on this page. Find the <span className="font-medium text-foreground">OpenAI</span> field under "Your Own API Keys" and paste your key there, then click <span className="font-medium text-foreground">Save</span>.
            </p>
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">That's it!</span> Your built in AI features will now use your own key with no monthly limit. Your credits will show as unlimited.
              </p>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "anthropic",
    label: "Anthropic (Claude)",
    icon: Brain,
    color: "text-orange-500",
    tagline: "Powers the AI Study Buddy for conversational learning support",
    features: ["AI Study Buddy chat"],
    steps: [
      {
        title: "Create an Anthropic account",
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Anthropic makes Claude, the AI that powers the Study Buddy. Create a free account to get started.
            </p>
            <a
              href="https://console.anthropic.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
            >
              Go to Anthropic Console <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        ),
      },
      {
        title: "Add billing to your account",
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Like OpenAI, Anthropic requires a payment method. You only pay for what you use.
            </p>
            <a
              href="https://console.anthropic.com/settings/billing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
            >
              Go to Anthropic billing <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Tip:</span> Anthropic offers $5 of free credits when you first sign up, which should last a long time for Study Buddy conversations.
              </p>
            </div>
          </div>
        ),
      },
      {
        title: "Generate your API key",
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Create a new API key for Allie to use.
            </p>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Click the link below to go to your API keys page</li>
              <li>Click <span className="font-medium text-foreground">"Create Key"</span></li>
              <li>Name it <span className="font-medium text-foreground">"Allie"</span></li>
              <li>Copy the key (it starts with <code className="px-1 py-0.5 rounded bg-muted text-xs">sk-ant-</code>)</li>
            </ol>
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
            >
              Go to Anthropic API keys <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        ),
      },
      {
        title: "Paste it into Allie",
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Find the <span className="font-medium text-foreground">Anthropic</span> field under "Your Own API Keys" in AI Settings and paste your key, then click <span className="font-medium text-foreground">Save</span>.
            </p>
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Done!</span> The AI Study Buddy will now use your own Anthropic key with unlimited access.
              </p>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "elevenlabs",
    label: "ElevenLabs",
    icon: Mic,
    color: "text-violet-500",
    tagline: "Adds unlimited Text to Speech usage for reading documents aloud",
    features: ["Text to Speech"],
    steps: [
      {
        title: "Create an ElevenLabs account",
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              ElevenLabs provides realistic voice technology. Create a free account to get started. No payment is required for the free tier.
            </p>
            <a
              href="https://elevenlabs.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
            >
              Go to ElevenLabs <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Good news:</span> The free tier includes a generous amount of voice generation each month, similar to what we offer inside the app. No credit card needed!
              </p>
            </div>
          </div>
        ),
      },
      {
        title: "Find your API key",
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Once logged in, navigate to your API key settings.
            </p>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Click the link below to go to your API key settings</li>
              <li>Your API key should be visible on the page</li>
              <li>Click the copy icon to copy it</li>
            </ol>
            <a
              href="https://elevenlabs.io/app/settings/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
            >
              Go to ElevenLabs API keys <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        ),
      },
      {
        title: "Paste it into Allie",
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Find the <span className="font-medium text-foreground">ElevenLabs</span> field under "Your Own API Keys" in AI Settings and paste your key, then click <span className="font-medium text-foreground">Save</span>.
            </p>
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">All set!</span> Text to Speech will now use your own ElevenLabs key for unlimited usage.
              </p>
            </div>
          </div>
        ),
      },
    ],
  },
];

export const APIKeyTutorialModal: React.FC<APIKeyTutorialModalProps> = ({ open, onOpenChange }) => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const provider = providerTutorials.find((p) => p.id === selectedProvider);

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setSelectedProvider(null);
      setCurrentStep(0);
    }
  };

  const handleNext = () => {
    if (provider && currentStep < provider.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after animation
    setTimeout(() => {
      setSelectedProvider(null);
      setCurrentStep(0);
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {provider ? `${provider.label} Setup Guide` : "API Key Setup Guide"}
          </DialogTitle>
        </DialogHeader>

        {!selectedProvider ? (
          // Provider selection screen
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Adding your own API keys gives you unlimited access to AI features. Choose a provider below to see the step by step setup instructions.
            </p>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 mb-2">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Don't worry!</span> You get 15 free AI uses per month without any setup. API keys are completely optional and only needed if you want unlimited access.
              </p>
            </div>

            <div className="space-y-3">
              {providerTutorials.map((prov) => {
                const Icon = prov.icon;
                return (
                  <button
                    key={prov.id}
                    onClick={() => {
                      setSelectedProvider(prov.id);
                      setCurrentStep(0);
                    }}
                    className="w-full text-left rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${prov.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{prov.label}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors ml-auto flex-shrink-0" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{prov.tagline}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {prov.features.map((f) => (
                            <Badge key={f} variant="secondary" className="text-[10px]">
                              {f}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : provider ? (
          // Step by step guide for selected provider
          <div className="space-y-4">
            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              {provider.steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i <= currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-[10px]">
                Step {currentStep + 1} of {provider.steps.length}
              </Badge>
            </div>

            {/* Step content */}
            <div>
              <h3 className="text-base font-semibold mb-3">
                {provider.steps[currentStep].title}
              </h3>
              {provider.steps[currentStep].content}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                {currentStep === 0 ? "All providers" : "Back"}
              </Button>
              {currentStep < provider.steps.length - 1 ? (
                <Button size="sm" onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button size="sm" onClick={handleClose}>
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Done
                </Button>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
