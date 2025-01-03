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
  text: "Hi - I'm your Allie, your virtual AI assistant. I'm here to help you get the best out of this web application. What can I help you with today?",
  isUser: false
};

export const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput("");

    try {
      const openai = await createOpenAIClient();
      if (!openai) {
        throw new Error("OpenAI client not initialized");
      }

      const apiMessages: ChatCompletionMessageParam[] = [
        { role: "system", content: SYSTEM_PROMPT } as const,
        ...messages.map(msg => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.text
        } as const)),
        { role: "user", content: input } as const
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
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
        description: "Please make sure you've added your OpenAI API key in the settings.",
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