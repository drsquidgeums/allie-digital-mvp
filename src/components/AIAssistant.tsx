import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Bot, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const { toast } = useToast();

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { text: input, isUser: true }]);
    setInput("");
    
    // Placeholder response - in a real implementation, this would call an AI API
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "I'm a demo assistant. In the full version, I'll be connected to an AI API to help you with your tasks!", 
        isUser: false 
      }]);
    }, 1000);

    toast({
      title: "Message sent",
      description: "The AI assistant will respond shortly",
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Bot className="w-4 h-4" />
        <h3 className="font-medium">AI Assistant</h3>
      </div>
      <div className="bg-background/50 rounded-lg p-3 h-[200px] overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg ${
              msg.isUser
                ? "bg-primary text-primary-foreground ml-auto"
                : "bg-muted"
            } max-w-[80%] ${msg.isUser ? "ml-auto" : "mr-auto"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend} size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};