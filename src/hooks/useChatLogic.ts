
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
    addAssistantMessage,
    addErrorMessage,
    addConnectionMessage
  } = useMessageHandling();

  const { getToolResponse } = useToolResponses();
  const { analyzeDocument } = useDocumentAnalysis();
  const { sendToOpenAI } = useChatAPI();

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const currentInput = input.trim();
    
    // Add user message immediately
    addUserMessage(currentInput);
    setInput("");
    setIsLoading(true);

    try {
      // Check for specific document analysis requests first
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
      
      // Show connection attempt message
      addConnectionMessage("Connecting to OpenAI...");
      
      // Try OpenAI API
      let response = null;
      let apiError = null;
      
      try {
        response = await sendToOpenAI(currentInput, messages);
      } catch (error) {
        apiError = error;
        addErrorMessage(`OpenAI API Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      }
      
      // Remove connection message
      setMessages(prev => prev.filter(msg => !msg.isConnecting));
      
      // Use OpenAI response if valid, otherwise fallback
      if (response && response.trim() && response.length > 5) {
        addAssistantMessage(response);
      } else {
        if (!apiError) {
          addErrorMessage("OpenAI returned an empty response. Using fallback...");
        }
        const fallbackResponse = getToolResponse(currentInput, documentContent);
        addAssistantMessage(fallbackResponse);
      }
      
    } catch (error) {
      // Remove any connection messages
      setMessages(prev => prev.filter(msg => !msg.isConnecting));
      
      addErrorMessage(`Chat Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      
      // Always provide a fallback response
      const fallbackResponse = getToolResponse(currentInput, documentContent);
      addAssistantMessage(fallbackResponse);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, getToolResponse, analyzeDocument, documentContent, messages, addUserMessage, addAssistantMessage, addErrorMessage, addConnectionMessage, sendToOpenAI, setInput, setIsLoading, setMessages]);

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
