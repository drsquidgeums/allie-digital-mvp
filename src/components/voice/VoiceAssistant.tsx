import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, PhoneOff, Loader2, Phone, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useVoiceConversation } from "@/contexts/VoiceConversationContext";
import { useElevenLabsBYOKPrompt } from "@/hooks/useElevenLabsBYOKPrompt";
import { ElevenLabsBYOKPrompt } from "@/components/byok/ElevenLabsBYOKPrompt";

export const VoiceAssistant: React.FC = () => {
  const {
    conversationStarted,
    isConnecting,
    isSpeaking,
    status,
    hasCredits,
    elevenlabsUsage,
    startConversation,
    endConversation,
    adjustVolume,
  } = useVoiceConversation();

  const { showPrompt, triggerPrompt, dismissPrompt } = useElevenLabsBYOKPrompt();

  const handleStart = () => {
    triggerPrompt();
    startConversation();
  };

  return (
    <>
    <ElevenLabsBYOKPrompt open={showPrompt} onDismiss={dismissPrompt} />
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          <CardTitle>Voice AI Assistant</CardTitle>
        </div>
        <CardDescription>
          Have a natural voice conversation about ADHD support, study strategies, and more
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!conversationStarted ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
              <p className="text-xs text-muted-foreground">
                Voice AI is powered by our built in assistant trained to help with ADHD related
                study support. Just click start and begin speaking!
              </p>
            </div>

            {!hasCredits && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Your ElevenLabs credits have been used up this month. Add your own ElevenLabs
                  API key in{" "}
                  <span className="font-medium text-foreground">Settings → AI Settings</span>{" "}
                  for unlimited access.
                </p>
              </div>
            )}

            {elevenlabsUsage && !elevenlabsUsage.hasOwnKey && hasCredits && (
              <p className="text-xs text-muted-foreground text-center">
                {elevenlabsUsage.remaining} Voice AI{" "}
                {elevenlabsUsage.remaining === 1 ? "use" : "uses"} remaining this month
              </p>
            )}

            <Button
              onClick={handleStart}
              disabled={isConnecting || !hasCredits}
              className="w-full"
              size="lg"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Start Voice Conversation
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-8 bg-primary/10 rounded-lg">
              <div className="text-center space-y-2">
                {isSpeaking ? (
                  <>
                    <Mic className="h-12 w-12 text-primary mx-auto animate-pulse" />
                    <p className="text-sm font-medium">AI is speaking...</p>
                  </>
                ) : (
                  <>
                    <Mic className="h-12 w-12 text-primary mx-auto" />
                    <p className="text-sm font-medium">Listening...</p>
                  </>
                )}
                <p className="text-xs text-muted-foreground">
                  Status: {status}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume">Volume</Label>
              <input
                id="volume"
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.8"
                onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <Button
              onClick={endConversation}
              variant="destructive"
              className="w-full"
              size="lg"
            >
              <PhoneOff className="mr-2 h-4 w-4" />
              End Conversation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
    </>
  );
};
