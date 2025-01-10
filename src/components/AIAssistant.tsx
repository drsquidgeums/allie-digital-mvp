import React from "react";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { useToast } from "@/hooks/use-toast";

export const AIAssistant = () => {
  const [messages, setMessages] = React.useState<{ text: string; isUser: boolean }[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newMessage = { text: inputValue, isUser: true };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Simulate AI response
      const aiResponse = { text: "This is a simulated AI response.", isUser: false };
      setMessages((prev) => [...prev, aiResponse]);
      
      // Announce new message for screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'New message received';
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to latest message
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="flex flex-col h-full p-4 gap-4" role="region" aria-label="AI Assistant Chat">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-4 p-4"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            text={message.text}
            isUser={message.isUser}
          />
        ))}
      </div>
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        isLoading={isLoading}
        aria-label="Chat input"
      />
    </Card>
  );
};