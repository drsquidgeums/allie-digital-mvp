
import { useCallback } from "react";
import { SYSTEM_PROMPT, createOpenAICompletion } from "@/utils/openai";

interface Message {
  text: string;
  isUser: boolean;
  isError?: boolean;
  isConnecting?: boolean;
}

export const useChatAPI = () => {
  const sendToOpenAI = useCallback(async (currentInput: string, messages: Message[]): Promise<string | null> => {
    try {
      console.log("=== CHAT API: Starting OpenAI request ===");
      console.log("Input:", currentInput);
      console.log("Message history length:", messages.length);
      
      const chatHistory = messages
        .filter(msg => !msg.isError && !msg.isConnecting) // Filter out error and connection messages
        .map(msg => ({
          role: msg.isUser ? "user" as const : "assistant" as const,
          content: msg.text
        }));
      
      // Add system prompt and current message
      const fullHistory = [
        {
          role: "system" as const,
          content: SYSTEM_PROMPT
        },
        ...chatHistory,
        {
          role: "user" as const,
          content: currentInput
        }
      ];
      
      console.log("=== CHAT API: Calling createOpenAICompletion ===");
      const responseText = await createOpenAICompletion(fullHistory);
      
      console.log("=== CHAT API: Response received ===");
      console.log("Response type:", typeof responseText);
      console.log("Response length:", responseText?.length);
      console.log("Response preview:", responseText?.substring(0, 100));
      
      if (responseText && typeof responseText === 'string' && responseText.trim().length > 0) {
        console.log("=== CHAT API: Returning valid response ===");
        return responseText.trim();
      }
      
      console.log("=== CHAT API: Response invalid, returning null ===");
      return null;
    } catch (error) {
      console.error("=== CHAT API: Error occurred ===");
      console.error("Error type:", typeof error);
      console.error("Error message:", error instanceof Error ? error.message : 'Unknown error');
      console.error("Full error:", error);
      return null;
    }
  }, []);

  return { sendToOpenAI };
};
