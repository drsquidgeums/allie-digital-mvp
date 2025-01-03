import React, { useState } from "react";
import { Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { createOpenAIClient, SYSTEM_PROMPT } from "@/utils/openai";

interface Message {
  text: string;
  isUser: boolean;
}

const INITIAL_MESSAGE: Message = {
  text: "Hi! I'm your ADHD Learning Assistant. I can help you make the most of our tools and provide study tips. Would you like help with: \n1. Using the Pomodoro Timer for focused study\n2. Creating effective mind maps\n3. Managing tasks and deadlines\n4. Setting up a distraction-free workspace\n5. Using color overlays for reading",
  isUser: false
};

export const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    try {
      const openai = createOpenAIClient();
    } catch (error) {
      toast({
        title: "API Key Missing",
        description: "Please set up your OpenAI API key to use the AI Assistant.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput("");

    try {
      const openai = createOpenAIClient();
      const apiMessages: ChatCompletionMessageParam[] = [
        { role: "system" as const, content: SYSTEM_PROMPT },
        ...messages.map(msg => ({
          role: msg.isUser ? "user" as const : "assistant" as const,
          content: msg.text
        })),
        { role: "user" as const, content: input }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 500
      });

      const aiResponse = response.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { text: aiResponse, isUser: false }]);
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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