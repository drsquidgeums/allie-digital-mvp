import React, { useState, useRef, useEffect } from "react";
import { Bot } from "lucide-react";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { Card } from "@/components/ui/card";

interface Message {
  text: string;
  isUser: boolean;
}

const INITIAL_MESSAGE: Message = {
  text: "Hi! I'm Allie, your virtual AI learning assistant. What can I help you with today?",
  isUser: false
};

export const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getToolResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes("irlen") || lowerInput.includes("overlay")) {
      return "The Irlen Overlay tool helps users with visual processing difficulties, including dyslexia. It adds a colored overlay to the screen which can reduce visual stress and make text easier to read. You can choose from different colors to find what works best for you.";
    }
    
    if (lowerInput.includes("font") || lowerInput.includes("opendyslexic") || lowerInput.includes("dyslexic")) {
      return "The Font Customization tool includes the OpenDyslexic font, which is specifically designed to help users with dyslexia. Its unique letter shapes and weighted bottoms can increase readability and reduce letter switching.";
    }
    
    if (lowerInput.includes("bionic") || lowerInput.includes("reader")) {
      return "The Bionic Reader helps improve focus and reading speed by highlighting parts of words. This can be particularly helpful for users with ADHD or reading difficulties, making it easier to maintain attention while reading.";
    }
    
    if (lowerInput.includes("color") || lowerInput.includes("separator")) {
      return "The Colour Separator tool allows you to highlight different parts of text in various colours. This can help with organising information, making complex texts more manageable, and improving comprehension for users with learning differences.";
    }
    
    if (lowerInput.includes("focus") || lowerInput.includes("mode")) {
      return "Focus Mode helps minimize distractions by entering fullscreen and hiding unnecessary elements. This is particularly helpful for users with ADHD who need to concentrate on their work.";
    }
    
    if (lowerInput.includes("pomodoro") || lowerInput.includes("timer")) {
      return "The Pomodoro Timer helps break work into manageable chunks with regular breaks. This is especially useful for users with ADHD, as it helps maintain focus and prevents mental fatigue.";
    }
    
    if (lowerInput.includes("mind") || lowerInput.includes("map")) {
      return "The Mind Mapping tool helps visualize connections between ideas. This visual approach to organizing information can be particularly helpful for users with different learning styles or those who prefer visual processing.";
    }
    
    if (lowerInput.includes("text") && lowerInput.includes("speech")) {
      return "The Text-to-Speech feature reads text aloud, which is helpful for users with dyslexia, visual processing difficulties, or those who learn better through auditory input.";
    }

    return "I can explain how our various tools help support different learning needs. You can ask about specific tools like the Irlen Overlay, OpenDyslexic font, Bionic Reader, Color Separator, Focus Mode, Pomodoro Timer, Mind Map, or Text-to-Speech feature. Which would you like to learn more about?";
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput("");

    const response = getToolResponse(input);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { text: response, isUser: false }]);
      setIsLoading(false);
    }, 1000);
  };

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
        <div className="flex items-center gap-2" role="banner">
          <Bot className="w-4 h-4" aria-hidden="true" />
          <h3 className="font-medium">Allie</h3>
        </div>
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