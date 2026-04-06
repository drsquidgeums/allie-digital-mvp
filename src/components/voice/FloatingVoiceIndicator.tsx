import React from "react";
import { PhoneOff, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceConversation } from "@/contexts/VoiceConversationContext";

export const FloatingVoiceIndicator: React.FC = () => {
  const { conversationStarted, isSpeaking, endConversation } = useVoiceConversation();

  if (!conversationStarted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-primary/30 bg-background/95 backdrop-blur-sm shadow-lg px-4 py-2 animate-in slide-in-from-bottom-4">
      <Mic className={`h-4 w-4 text-primary ${isSpeaking ? "animate-pulse" : ""}`} />
      <span className="text-sm font-medium text-foreground">
        {isSpeaking ? "AI speaking..." : "Listening..."}
      </span>
      <Button
        onClick={endConversation}
        variant="destructive"
        size="sm"
        className="ml-1 h-7 px-2 rounded-full"
      >
        <PhoneOff className="h-3 w-3 mr-1" />
        End
      </Button>
    </div>
  );
};
