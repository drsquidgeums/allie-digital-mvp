import React, { useState, useCallback, useRef } from "react";
import { useConversation } from "@11labs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, PhoneOff, Loader2, Phone, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { notifyAICreditsUsed } from "@/utils/aiCreditsEvent";
import { Label } from "@/components/ui/label";
import { useAIUsage } from "@/hooks/useAIUsage";
import { handleAIUsageLimitError } from "@/utils/aiUsageLimitHandler";

export const VoiceAssistant: React.FC = () => {
  const { toast } = useToast();
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { usage } = useAIUsage();
  const hasTrackedSessionRef = useRef(false);

  const elevenlabsUsage = usage?.byProvider?.find((p) => p.name === "elevenlabs");
  const hasCredits = elevenlabsUsage
    ? elevenlabsUsage.hasOwnKey || elevenlabsUsage.remaining > 0
    : true;

  const trackConnectedSession = useCallback(async () => {
    if (hasTrackedSessionRef.current) return;

    hasTrackedSessionRef.current = true;

    const { error } = await supabase.functions.invoke("elevenlabs-session", {
      body: { mode: "track" },
    });

    if (error) {
      hasTrackedSessionRef.current = false;
      console.error("Failed to track connected voice session:", error);
      return;
    }

    notifyAICreditsUsed();
  }, []);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Voice conversation connected via WebRTC");
      setConversationStarted(true);
      setIsConnecting(false);
      void trackConnectedSession();
      toast({
        title: "Connected",
        description: "Voice assistant is ready to chat",
      });
    },
    onDisconnect: () => {
      console.log("Voice conversation disconnected");
      hasTrackedSessionRef.current = false;
      setConversationStarted(false);
      toast({
        title: "Disconnected",
        description: "Voice conversation ended",
      });
    },
    onError: (error) => {
      console.error("Voice conversation error:", error);
      const message =
        (typeof error === "string" && error) ||
        (error && (error as any).message) ||
        "Failed to connect to voice assistant";

      const helpful =
        message.includes("AudioWorklet") || message.includes("worklet")
          ? "Audio module blocked by browser/CSP. Try Chrome desktop or open the app in a new tab (outside the editor preview)."
          : message.includes("LiveKit") || message.includes("rtc") || message.includes("RTCPeerConnection")
            ? "Realtime voice connection was blocked, so the app will fall back to the more compatible connection mode where possible."
          : undefined;

      toast({
        title: "Connection Error",
        description: helpful ? `${message} — ${helpful}` : message,
        variant: "destructive",
      });
      setConversationStarted(false);
      setIsConnecting(false);
    },
    onMessage: (message) => {
      console.log("Received message:", message);
    },
  });

  const startConversation = async () => {
    setIsConnecting(true);
    hasTrackedSessionRef.current = false;

    try {
      // Request microphone access first
      const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      permissionStream.getTracks().forEach((track) => track.stop());

      // Get connection credentials from our edge function
      const { data, error } = await supabase.functions.invoke("elevenlabs-session", {
        body: { mode: "session" },
      });

      if (error) {
        if (handleAIUsageLimitError(error)) return;

        const rawMessage = error.message || "Failed to get session token";
        const friendlyMessage = rawMessage.includes("authentication failed")
          ? "Voice AI key was rejected by ElevenLabs. Re-check the ELEVENLABS_API_KEY secret in Supabase, or add your own key in Settings → AI Settings."
          : rawMessage;

        throw new Error(friendlyMessage);
      }

      const sessionAttempts: Array<
        | {
            label: "webrtc";
            options: { conversationToken: string; connectionType: "webrtc" };
          }
        | {
            label: "websocket";
            options: { signedUrl: string; connectionType: "websocket" };
          }
      > = [];

      const isPreviewEnvironment =
        window.location.hostname.includes("lovableproject.com") ||
        new URLSearchParams(window.location.search).has("__lovable_token");

      if (isPreviewEnvironment && data?.signed_url) {
        sessionAttempts.push({
          label: "websocket",
          options: {
            signedUrl: data.signed_url,
            connectionType: "websocket",
          },
        });
      }

      if (data?.conversation_token) {
        sessionAttempts.push({
          label: "webrtc",
          options: {
            conversationToken: data.conversation_token,
            connectionType: "webrtc",
          },
        });
      }

      if (!isPreviewEnvironment && data?.signed_url) {
        sessionAttempts.push({
          label: "websocket",
          options: {
            signedUrl: data.signed_url,
            connectionType: "websocket",
          },
        });
      }

      if (!sessionAttempts.length) {
        throw new Error("No voice session credentials received");
      }

      let lastConnectionError: unknown = null;

      for (const attempt of sessionAttempts) {
        try {
          await conversation.startSession(attempt.options);
          lastConnectionError = null;
          break;
        } catch (sessionError) {
          lastConnectionError = sessionError;
          console.error(`Voice ${attempt.label} connection failed:`, sessionError);

          try {
            await conversation.endSession();
          } catch {
            // Ignore cleanup errors between fallback attempts
          }
        }
      }

      if (lastConnectionError) {
        throw lastConnectionError instanceof Error
          ? lastConnectionError
          : new Error("Failed to start voice conversation");
      }
    } catch (err) {
      console.error("Error starting conversation:", err);
      setConversationStarted(false);
      toast({
        title: "Connection Failed",
        description: err instanceof Error ? err.message : "Failed to start conversation",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
      setConversationStarted(false);
    } catch (err) {
      console.error("Error ending conversation:", err);
    }
  };

  const adjustVolume = useCallback(
    async (value: number) => {
      try {
        await conversation.setVolume({ volume: value });
      } catch (err) {
        console.error("Error adjusting volume:", err);
      }
    },
    [conversation]
  );

  return (
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
              onClick={startConversation}
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
                {conversation.isSpeaking ? (
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
                  Status: {conversation.status}
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
  );
};
