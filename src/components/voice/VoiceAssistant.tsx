import React, { useState, useCallback } from "react";
import { useConversation } from "@11labs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Phone, PhoneOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const VoiceAssistant: React.FC = () => {
  const { toast } = useToast();
  const [agentId, setAgentId] = useState("");
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Voice conversation connected");
      toast({
        title: "Connected",
        description: "Voice assistant is ready to chat",
      });
    },
    onDisconnect: () => {
      console.log("Voice conversation disconnected");
      setConversationStarted(false);
      toast({
        title: "Disconnected",
        description: "Voice conversation ended",
      });
    },
    onError: (error) => {
      console.error("Voice conversation error:", error);
      toast({
        title: "Error",
        description: error || "Failed to connect to voice assistant",
        variant: "destructive",
      });
      setIsConnecting(false);
    },
    onMessage: (message) => {
      console.log("Received message:", message);
    },
  });

  const startConversation = async () => {
    if (!agentId.trim()) {
      toast({
        title: "Agent ID Required",
        description: "Please enter your ElevenLabs agent ID",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);

    try {
      // Request microphone access first
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get signed URL from our edge function
      const { data, error } = await supabase.functions.invoke('elevenlabs-session', {
        body: { agentId: agentId.trim() }
      });

      if (error) {
        throw new Error(error.message || "Failed to get session URL");
      }

      if (!data?.signed_url) {
        throw new Error("No signed URL received");
      }

      // Start the conversation with the signed URL
      await conversation.startSession({
        signedUrl: data.signed_url,
      });
      setConversationStarted(true);
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to start conversation",
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
    } catch (error) {
      console.error("Error ending conversation:", error);
    }
  };

  const adjustVolume = useCallback(async (value: number) => {
    try {
      await conversation.setVolume({ volume: value });
    } catch (error) {
      console.error("Error adjusting volume:", error);
    }
  }, [conversation]);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          <CardTitle>Voice AI Assistant</CardTitle>
        </div>
        <CardDescription>
          Have natural voice conversations powered by ElevenLabs AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!conversationStarted ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agentId">ElevenLabs Agent ID</Label>
              <Input
                id="agentId"
                placeholder="Enter your agent ID"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                disabled={isConnecting}
              />
              <p className="text-xs text-muted-foreground">
                You can find this in your ElevenLabs dashboard under Conversational AI
              </p>
            </div>

            <Button
              onClick={startConversation}
              disabled={isConnecting || !agentId.trim()}
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
