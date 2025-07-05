
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

    console.log("Processing user input:", input);
    const currentInput = input.trim();
    
    // Add user message immediately
    addUserMessage(currentInput);
    setInput("");
    setIsLoading(true);

    try {
      console.log("Current messages before processing:", messages);
      
      // Check for specific document analysis requests
      if (documentContent) {
        const lowerInput = currentInput.toLowerCase();
        if (lowerInput.includes("analyze") && lowerInput.includes("document")) {
          console.log("Analyzing document...");
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
      
      // Try OpenAI API first
      console.log("Attempting OpenAI API call...");
      let response = null;
      
      try {
        response = await sendToOpenAI(currentInput, messages);
        console.log("OpenAI API response:", response);
      } catch (error) {
        console.log("OpenAI API error:", error);
      }
      
      // Use response from API or fallback
      if (response && response.trim()) {
        console.log("Using OpenAI API response");
        addAssistantMessage(response);
      } else {
        console.log("Using fallback tool response");
        const fallbackResponse = getToolResponse(currentInput, documentContent);
        console.log("Generated fallback response:", fallbackResponse);
        addAssistantMessage(fallbackResponse);
      }
      
    } catch (error) {
      console.error("Error in chat flow:", error);
      // Always provide a fallback response
      const fallbackResponse = getToolResponse(currentInput, documentContent);
      console.log("Error fallback response:", fallbackResponse);
      addAssistantMessage(fallbackResponse);
    } finally {
      setIsLoading(false);
      console.log("Chat processing completed");
    }
  }, [input, isLoading, getToolResponse, analyzeDocument, documentContent, messages, addUserMessage, addAssistantMessage, sendToOpenAI, setInput, setIsLoading]);

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
