
import { useState, useCallback } from "react";

interface Message {
  text: string;
  isUser: boolean;
  isError?: boolean;
  isConnecting?: boolean;
}

export const useMessageHandling = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => {
      const newMessages = [...prev, message];
      return newMessages;
    });
  }, []);

  const addUserMessage = useCallback((text: string) => {
    addMessage({ text, isUser: true });
  }, [addMessage]);

  const addAssistantMessage = useCallback((text: string) => {
    if (!text || text.trim().length === 0) {
      addMessage({ 
        text: "I'm having trouble generating a response right now. Please try again.", 
        isUser: false, 
        isError: true 
      });
      return;
    }
    addMessage({ text, isUser: false });
  }, [addMessage]);

  const addErrorMessage = useCallback((errorText: string) => {
    addMessage({ 
      text: errorText, 
      isUser: false, 
      isError: true 
    });
  }, [addMessage]);

  const addConnectionMessage = useCallback((text: string) => {
    addMessage({ 
      text, 
      isUser: false, 
      isConnecting: true 
    });
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
    addAssistantMessage,
    addErrorMessage,
    addConnectionMessage
  };
};
