import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Bot, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    {
      text: "Hello! I'm your AI assistant, specialized in helping learners with ADHD and other learning differences. How can I help you today? You can ask me about study techniques, organization tips, or workspace customization!",
      isUser: false
    }
  ]);
  const { toast } = useToast();

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { text: input, isUser: true }]);
    setInput("");
    
    // Simulated ADHD-focused responses
    setTimeout(() => {
      const adhd_responses = [
        "Here's a helpful study tip: Try the Pomodoro technique with our timer - 25 minutes of focused work, then a 5-minute break. This helps maintain attention and reduces overwhelm.",
        "Consider using our mind mapping tool to break down complex topics into smaller, more manageable pieces. Visual organization can really help with information processing!",
        "The color overlay feature can help reduce visual stress while reading. Try different colors to find what works best for you.",
        "Remember to take regular breaks using our Pomodoro timer. It's especially important for maintaining focus and preventing mental fatigue."
      ];
      
      setMessages(prev => [...prev, { 
        text: adhd_responses[Math.floor(Math.random() * adhd_responses.length)], 
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
        <h3 className="font-medium">ADHD Learning Assistant</h3>
      </div>
      <div className="bg-card rounded-lg p-3 h-[200px] overflow-y-auto space-y-2">
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
          placeholder="Ask for study tips or workspace help..."
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend} size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};