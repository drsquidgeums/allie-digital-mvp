
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

    console.log("=== CHAT SEND STARTED ===");
    console.log("Processing user input:", input);
    console.log("Current messages count:", messages.length);
    
    const currentInput = input.trim();
    
    // Add user message immediately
    console.log("Adding user message to state");
    addUserMessage(currentInput);
    setInput("");
    setIsLoading(true);

    try {
      // Check for specific document analysis requests
      if (documentContent) {
        const lowerInput = currentInput.toLowerCase();
        if (lowerInput.includes("analyze") && lowerInput.includes("document")) {
          console.log("Analyzing document...");
          const response = await analyzeDocument(documentContent);
          console.log("Document analysis response:", response);
          addAssistantMessage(response);
          setIsLoading(false);
          return;
        }
        
        // Handle specific writing assistance requests
        if (lowerInput.includes("check grammar") || lowerInput.includes("proofread")) {
          const response = "I can help check the grammar in your loaded document. Here's what I can review:\n\n• Sentence structure and clarity\n• Punctuation and capitalization\n• Word choice and flow\n• Consistency in style and tone\n\nWould you like me to analyze the entire document or focus on a specific section?";
          console.log("Grammar check response:", response);
          addAssistantMessage(response);
          setIsLoading(false);
          return;
        }
      }
      
      // Try OpenAI API first
      console.log("=== ATTEMPTING OPENAI API CALL ===");
      let response = null;
      
      try {
        response = await sendToOpenAI(currentInput, messages);
        console.log("OpenAI API call completed. Response:", response);
      } catch (error) {
        console.error("OpenAI API call failed:", error);
      }
      
      // Use response from API or fallback
      if (response && response.trim() && response.length > 5) {
        console.log("=== USING OPENAI RESPONSE ===");
        console.log("Response length:", response.length);
        addAssistantMessage(response);
      } else {
        console.log("=== USING FALLBACK RESPONSE ===");
        console.log("OpenAI response was:", response);
        const fallbackResponse = getToolResponse(currentInput, documentContent);
        console.log("Generated fallback response:", fallbackResponse);
        console.log("Fallback response length:", fallbackResponse.length);
        addAssistantMessage(fallbackResponse);
      }
      
    } catch (error) {
      console.error("=== ERROR IN CHAT FLOW ===");
      console.error("Error details:", error);
      // Always provide a fallback response
      const fallbackResponse = getToolResponse(currentInput, documentContent);
      console.log("Error fallback response:", fallbackResponse);
      addAssistantMessage(fallbackResponse);
    } finally {
      setIsLoading(false);
      console.log("=== CHAT SEND COMPLETED ===");
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
