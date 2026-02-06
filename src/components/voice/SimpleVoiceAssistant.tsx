import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Phone, PhoneOff, Loader2 } from "lucide-react";
import { useVoiceChat } from "@/hooks/useVoiceChat";

export const SimpleVoiceAssistant: React.FC = () => {
  const {
    isActive,
    isListening,
    isSpeaking,
    isProcessing,
    transcript,
    startSession,
    stopSession
  } = useVoiceChat();

  const getStatusText = () => {
    if (isProcessing) return "Thinking...";
    if (isSpeaking) return "Allie is speaking...";
    if (isListening) return "Listening...";
    return "Ready";
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          <CardTitle>Voice AI Assistant</CardTitle>
        </div>
        <CardDescription>
          Have natural voice conversations with Allie, your study assistant
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isActive ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click below to start a voice conversation. Allie will help you with your studies, 
              explain concepts, and keep you motivated.
            </p>

            <Button
              onClick={startSession}
              className="w-full"
              size="lg"
            >
              <Mic className="mr-2 h-4 w-4" />
              Start Voice Conversation
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Requires microphone access • Works best in Chrome or Edge
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-8 bg-primary/10 rounded-lg">
              <div className="text-center space-y-2">
                {isProcessing ? (
                  <>
                    <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
                    <p className="text-sm font-medium">Thinking...</p>
                  </>
                ) : isSpeaking ? (
                  <>
                    <Mic className="h-12 w-12 text-primary mx-auto animate-pulse" />
                    <p className="text-sm font-medium">Allie is speaking...</p>
                  </>
                ) : isListening ? (
                  <>
                    <Mic className="h-12 w-12 text-primary mx-auto animate-pulse" />
                    <p className="text-sm font-medium">Listening...</p>
                  </>
                ) : (
                  <>
                    <MicOff className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-sm font-medium">Paused</p>
                  </>
                )}
                
                {transcript && (
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    "{transcript}"
                  </p>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Status: {getStatusText()}
                </p>
              </div>
            </div>

            <Button
              onClick={stopSession}
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
