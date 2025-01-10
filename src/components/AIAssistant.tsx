import React, { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { ChatHeader } from "./chat/ChatHeader";
import { useChatLogic } from "@/hooks/useChatLogic";

export const AIAssistant = () => {
  const { input, setInput, messages, isLoading, handleSend } = useChatLogic();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setInput('');
    }
  };

  return (
    <Card 
      className="h-full bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative border-none shadow-lg ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      role="region"
      aria-label="AI Assistant Chat Interface"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="p-4 space-y-4">
        <ChatHeader />
        <div 
          className="bg-card rounded-lg p-3 h-[calc(100vh-12rem)] overflow-y-auto space-y-2 focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out"
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
          tabIndex={0}
        >
          {messages.map((msg, idx) => (
            <ChatMessage 
              key={idx} 
              text={msg.text} 
              isUser={msg.isUser}
              tabIndex={0}
            />
          ))}
          {isLoading && (
            <div 
              className="flex items-center gap-2" 
              aria-label="Loading response"
              role="status"
            >
              <div className="w-12 h-6 bg-muted/50 rounded animate-pulse" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          isLoading={isLoading}
        />
      </div>
    </Card>
  );
};