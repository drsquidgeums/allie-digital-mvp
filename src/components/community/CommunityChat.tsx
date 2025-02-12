import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "../chat/ChatMessage";
import { ChatInput } from "../chat/ChatInput";

export const CommunityChat = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { text: inputValue, isUser: true }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Thanks for your message! Our team will get back to you soon.", 
        isUser: false 
      }]);
      setInputValue("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Chat with Us</h2>
      <div className="space-y-4">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))}
          </div>
        </ScrollArea>
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </Card>
  );
};