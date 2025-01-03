import React, { useState } from "react";
import { Bot } from "lucide-react";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";

interface Message {
  text: string;
  isUser: boolean;
}

const INITIAL_MESSAGE: Message = {
  text: "Hi - I'm your Allie, your virtual AI assistant. I'm here to help you get the best out of this web application. What can I help you with today?",
  isUser: false
};

export const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput("");

    // Simple response system
    const response = "I understand you're asking about " + input + ". As an ADHD Learning Assistant, I'm here to help you use our workspace tools effectively. Could you please be more specific about what you'd like to know?";
    
    setTimeout(() => {
      setMessages(prev => [...prev, { text: response, isUser: false }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Bot className="w-4 h-4" />
        <h3 className="font-medium">ADHD Learning Assistant</h3>
      </div>
      <div className="bg-card rounded-lg p-3 h-[300px] overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} text={msg.text} isUser={msg.isUser} />
        ))}
      </div>
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        isLoading={isLoading}
      />
    </div>
  );
};