
import { useState, useCallback } from "react";

interface Message {
  text: string;
  isUser: boolean;
}

export const useMessageHandling = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((message: Message) => {
    console.log("Adding message:", message);
    setMessages(prev => {
      const newMessages = [...prev, message];
      console.log("Updated messages:", newMessages);
      return newMessages;
    });
  }, []);

  const addUserMessage = useCallback((text: string) => {
    console.log("Adding user message:", text);
    addMessage({ text, isUser: true });
  }, [addMessage]);

  const addAssistantMessage = useCallback((text: string) => {
    console.log("Adding assistant message:", text);
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
