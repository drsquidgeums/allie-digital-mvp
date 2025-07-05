
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
    console.log("=== ADDING MESSAGE ===");
    console.log("Message:", message);
    console.log("Message text length:", message.text.length);
    
    setMessages(prev => {
      const newMessages = [...prev, message];
      console.log("Previous message count:", prev.length);
      console.log("New message count:", newMessages.length);
      console.log("All messages:", newMessages);
      return newMessages;
    });
  }, []);

  const addUserMessage = useCallback((text: string) => {
    console.log("Adding user message with text:", text);
    addMessage({ text, isUser: true });
  }, [addMessage]);

  const addAssistantMessage = useCallback((text: string) => {
    console.log("Adding assistant message with text:", text);
    console.log("Text length:", text.length);
    if (!text || text.trim().length === 0) {
      console.error("WARNING: Trying to add empty assistant message!");
      return;
    }
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
