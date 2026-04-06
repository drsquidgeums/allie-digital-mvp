import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { useConversation } from "@11labs/react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { notifyAICreditsUsed } from "@/utils/aiCreditsEvent";
import { useAIUsage } from "@/hooks/useAIUsage";
import { handleAIUsageLimitError } from "@/utils/aiUsageLimitHandler";

interface VoiceConversationContextType {
  conversationStarted: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  status: string;
  hasCredits: boolean;
  elevenlabsUsage: { remaining: number; hasOwnKey: boolean } | undefined;
  startConversation: () => Promise<void>;
  endConversation: () => Promise<void>;
  adjustVolume: (value: number) => Promise<void>;
}

const VoiceConversationContext = createContext<VoiceConversationContextType | null>(null);

export const useVoiceConversation = () => {
  const ctx = useContext(VoiceConversationContext);
  if (!ctx) throw new Error("useVoiceConversation must be used within VoiceConversationProvider");
  return ctx;
};

export const VoiceConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
          ? "Audio module blocked by browser/CSP. Try Chrome desktop or open the app in a new tab."
          : message.includes("LiveKit") || message.includes("rtc") || message.includes("RTCPeerConnection")
            ? "Realtime voice connection was blocked, falling back to compatible mode."
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

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    hasTrackedSessionRef.current = false;

    try {
      const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      permissionStream.getTracks().forEach((track) => track.stop());

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
        | { label: "webrtc"; options: { conversationToken: string; connectionType: "webrtc" } }
        | { label: "websocket"; options: { signedUrl: string; connectionType: "websocket" } }
      > = [];

      const isPreviewEnvironment =
        window.location.hostname.includes("lovableproject.com") ||
        new URLSearchParams(window.location.search).has("__lovable_token");

      if (isPreviewEnvironment && data?.signed_url) {
        sessionAttempts.push({
          label: "websocket",
          options: { signedUrl: data.signed_url, connectionType: "websocket" },
        });
      }

      if (data?.conversation_token) {
        sessionAttempts.push({
          label: "webrtc",
          options: { conversationToken: data.conversation_token, connectionType: "webrtc" },
        });
      }

      if (!isPreviewEnvironment && data?.signed_url) {
        sessionAttempts.push({
          label: "websocket",
          options: { signedUrl: data.signed_url, connectionType: "websocket" },
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
          try { await conversation.endSession(); } catch {}
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
  }, [conversation, toast, trackConnectedSession]);

  const endConversation = useCallback(async () => {
    try {
      await conversation.endSession();
      setConversationStarted(false);
    } catch (err) {
      console.error("Error ending conversation:", err);
    }
  }, [conversation]);

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
    <VoiceConversationContext.Provider
      value={{
        conversationStarted,
        isConnecting,
        isSpeaking: conversation.isSpeaking,
        status: conversation.status,
        hasCredits,
        elevenlabsUsage: elevenlabsUsage as any,
        startConversation,
        endConversation,
        adjustVolume,
      }}
    >
      {children}
    </VoiceConversationContext.Provider>
  );
};
