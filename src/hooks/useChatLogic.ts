
import { useCallback } from "react";
import { useMessageHandling } from "./chat/useMessageHandling";
import { useToolResponses } from "./chat/useToolResponses";
import { useDocumentAnalysis } from "./chat/useDocumentAnalysis";
import { useChatAPI } from "./chat/useChatAPI";

export const useChatLogic = (documentContent?: string) => {
  const {
    input,
    setInput,
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    addUserMessage,
    addAssistantMessage
  } = useMessageHandling();

  const { getToolResponse } = useToolResponses();
  const { analyzeDocument } = useDocumentAnalysis();
  const { sendToOpenAI } = useChatAPI();

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    console.log("Sending message:", input);
    setIsLoading(true);
    addUserMessage(input);
    const currentInput = input;
    setInput("");

    try {
      // Check for specific document analysis requests
      if (documentContent) {
        const lowerInput = currentInput.toLowerCase();
        if (lowerInput.includes("analyze") && lowerInput.includes("document")) {
          const response = await analyzeDocument(documentContent);
          addAssistantMessage(response);
          setIsLoading(false);
          return;
        }
        
        // Handle specific writing assistance requests
        if (lowerInput.includes("check grammar") || lowerInput.includes("proofread")) {
          const response = "I can help check the grammar in your loaded document. Here's what I can review:\n\n• Sentence structure and clarity\n• Punctuation and capitalization\n• Word choice and flow\n• Consistency in style and tone\n\nWould you like me to analyze the entire document or focus on a specific section?";
          addAssistantMessage(response);
          setIsLoading(false);
          return;
        }
      }
      
      // Try OpenAI API first, but always fall back to tool responses
      const apiResponse = await sendToOpenAI(currentInput, messages);
      
      if (apiResponse) {
        addAssistantMessage(apiResponse);
      } else {
        // Always use fallback response if API fails or is unavailable
        const fallbackResponse = getToolResponse(currentInput, documentContent);
        addAssistantMessage(fallbackResponse);
      }
      
    } catch (error) {
      console.error("Error in chat flow:", error);
      const fallbackResponse = getToolResponse(currentInput, documentContent);
      addAssistantMessage(fallbackResponse);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, getToolResponse, analyzeDocument, documentContent, messages, setInput, setIsLoading, addUserMessage, addAssistantMessage, sendToOpenAI]);

  return {
    input,
    setInput,
    messages,
    setMessages,
    isLoading,
    handleSend,
    analyzeDocument
  };
};
