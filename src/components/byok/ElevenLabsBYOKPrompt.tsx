import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Key, Mic, AudioLines, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ElevenLabsBYOKPromptProps {
  open: boolean;
  onDismiss: (permanent?: boolean) => void;
}

export const ElevenLabsBYOKPrompt: React.FC<ElevenLabsBYOKPromptProps> = ({
  open,
  onDismiss,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleGoToSettings = () => {
    onDismiss(dontShowAgain);
    navigate("/settings");
  };

  const handleDismiss = () => {
    onDismiss(dontShowAgain);
  };

  return (
    <Dialog open={open} onOpenChange={() => handleDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <DialogTitle>Unlock Unlimited Voice Features</DialogTitle>
          </div>
          <DialogDescription>
            This feature is powered by ElevenLabs and includes a free monthly quota of 10 uses.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <p className="text-sm text-foreground">
            Add your own <span className="font-medium">free</span> ElevenLabs API key in Settings for unlimited access to:
          </p>

          <div className="space-y-2">
            {[
              { icon: MessageSquare, label: "Voice AI Assistant" },
              { icon: Mic, label: "Text-to-Speech" },
              { icon: AudioLines, label: "Transcription / Dictation" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 text-primary" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs text-muted-foreground">
              ElevenLabs offers a free tier with generous limits. You can get your API key at{" "}
              <a
                href="https://elevenlabs.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                elevenlabs.io
              </a>
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3 sm:flex-col">
          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={handleDismiss} className="flex-1">
              Maybe Later
            </Button>
            <Button onClick={handleGoToSettings} className="flex-1">
              Go to Settings
            </Button>
          </div>
          <div className="flex items-center gap-2 w-full">
            <Checkbox
              id="byok-dont-show"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked === true)}
            />
            <label
              htmlFor="byok-dont-show"
              className="text-xs text-muted-foreground cursor-pointer"
            >
              Don't show this again
            </label>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
