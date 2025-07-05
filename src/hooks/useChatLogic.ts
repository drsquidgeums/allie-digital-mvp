
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
    console.log("=== CHAT LOGIC: Starting message send ===");
    console.log("Input:", currentInput);
    
    // Add user message immediately
    addUserMessage(currentInput);
    setInput("");
    setIsLoading(true);

    try {
      // Check for specific document analysis requests first
      if (documentContent) {
        const lowerInput = currentInput.toLowerCase();
        if (lowerInput.includes("analyze") && lowerInput.includes("document")) {
          console.log("=== CHAT LOGIC: Document analysis requested ===");
          const response = await analyzeDocument(documentContent);
          addAssistantMessage(response);
          setIsLoading(false);
          return;
        }
        
        // Handle specific writing assistance requests
        if (lowerInput.includes("check grammar") || lowerInput.includes("proofread")) {
          console.log("=== CHAT LOGIC: Grammar check requested ===");
          const response = "I can help check the grammar in your loaded document. Here's what I can review:\n\n• Sentence structure and clarity\n• Punctuation and capitalization\n• Word choice and flow\n• Consistency in style and tone\n\nWould you like me to analyze the entire document or focus on a specific section?";
          addAssistantMessage(response);
          setIsLoading(false);
          return;
        }
      }
      
      // Show connection attempt message
      console.log("=== CHAT LOGIC: Adding connection message ===");
      addConnectionMessage("Connecting to OpenAI...");
      
      // Try OpenAI API
      console.log("=== CHAT LOGIC: Attempting OpenAI call ===");
      let openAIResponse = null;
      let apiError = null;
      
      try {
        openAIResponse = await sendToOpenAI(currentInput, messages.filter(m => !m.isConnecting && !m.isError));
        console.log("=== CHAT LOGIC: OpenAI response received ===", openAIResponse);
      } catch (error) {
        console.log("=== CHAT LOGIC: OpenAI error caught ===", error);
        apiError = error;
      }
      
      // Remove connection message
      console.log("=== CHAT LOGIC: Removing connection messages ===");
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isConnecting);
        console.log("Messages after filtering:", filtered.length);
        return filtered;
      });
      
      // Use OpenAI response if valid, otherwise fallback
      if (openAIResponse && typeof openAIResponse === 'string' && openAIResponse.trim().length > 0) {
        console.log("=== CHAT LOGIC: Using OpenAI response ===");
        addAssistantMessage(openAIResponse.trim());
      } else {
        console.log("=== CHAT LOGIC: Using fallback response ===");
        if (apiError) {
          console.log("API Error details:", apiError);
          // Don't show the error to user, just use fallback
        }
        const fallbackResponse = getToolResponse(currentInput, documentContent);
        addAssistantMessage(fallbackResponse);
      }
      
    } catch (error) {
      console.error("=== CHAT LOGIC: Unexpected error ===", error);
      
      // Remove any connection messages
      setMessages(prev => prev.filter(msg => !msg.isConnecting));
      
      // Always provide a fallback response
      const fallbackResponse = getToolResponse(currentInput, documentContent);
      addAssistantMessage(fallbackResponse);
    } finally {
      console.log("=== CHAT LOGIC: Setting loading to false ===");
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
