
import React from "react";
import { cn } from "@/lib/utils";
import { Bot, User, AlertCircle, Loader2 } from "lucide-react";

interface ChatMessageProps {
  text: string;
  isUser: boolean;
  tabIndex?: number;
  isError?: boolean;
  isConnecting?: boolean;
}

export const ChatMessage = React.memo(({ text, isUser, tabIndex, isError = false, isConnecting = false }: ChatMessageProps) => {
  return (
    <div 
      className={cn(
        "flex gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out",
        isUser 
          ? "bg-primary text-primary-foreground ml-8 flex-row-reverse" 
          : "bg-muted/50 mr-8",
        isError && "bg-red-100 border border-red-300 text-red-800",
        isConnecting && "bg-blue-50 border border-blue-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      )}
      role="article"
      aria-label={`${isUser ? "User" : "Assistant"} message`}
      tabIndex={tabIndex}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUser ? "bg-primary-foreground/20" : "bg-primary/10"
      )}>
        {isError ? (
          <AlertCircle className="w-4 h-4 text-red-600" />
        ) : isConnecting ? (
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        ) : isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>
      <div className="flex-1 space-y-1 min-w-0">
        <div className={cn(
          "text-xs font-medium",
          isUser ? "text-primary-foreground/80" : "text-muted-foreground",
          isConnecting && "text-blue-600"
        )}>
          {isError ? "Error" : isUser ? "You" : isConnecting ? "Allie (connecting...)" : "Allie"}
        </div>
        <div className={cn(
          "text-sm leading-relaxed whitespace-pre-wrap break-words",
          isError && "font-medium",
          isConnecting && "text-blue-700"
        )}>
          {text}
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";
