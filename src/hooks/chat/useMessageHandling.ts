
import { useState, useCallback } from "react";

interface Message {
  text: string;
  isUser: boolean;
}

const INITIAL_MESSAGE: Message = {
  text: "Hi! I'm Allie.ai, your virtual learning assistant. I can help you with document analysis, writing assistance, and research. What can I help you with today?",
  isUser: false
};

export const useMessageHandling = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const addUserMessage = useCallback((text: string) => {
    addMessage({ text, isUser: true });
  }, [addMessage]);

  const addAssistantMessage = useCallback((text: string) => {
    addMessage({ text, isUser: false });
  }, [addMessage]);

  return {
    input,
    setInput,
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    addMessage,
    addUserMessage,
    addAssistantMessage
  };
};
