
import { useCallback } from "react";
import { createOpenAICompletion, SYSTEM_PROMPT } from "@/utils/openai";

interface Message {
  text: string;
  isUser: boolean;
  isError?: boolean;
  isConnecting?: boolean;
}

export const useChatAPI = () => {
  const sendToOpenAI = useCallback(async (currentInput: string, messages: Message[]): Promise<string | null> => {
    try {
      console.log("=== CHAT API: Preparing OpenAI request ===");
      
      const chatHistory = messages
        .filter(msg => !msg.isError && !msg.isConnecting)
        .map(msg => ({
          role: msg.isUser ? "user" as const : "assistant" as const,
          content: msg.text
        }));
      
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
      
      console.log("=== CHAT API: Sending to OpenAI ===");
      const responseText = await createOpenAICompletion(fullHistory);
      
      if (responseText && typeof responseText === 'string' && responseText.trim().length > 0) {
        console.log("=== CHAT API: Valid OpenAI response received ===");
        return responseText.trim();
      }
      
      console.log("=== CHAT API: Invalid or empty OpenAI response ===");
      return null;
    } catch (error) {
      console.error("=== CHAT API: OpenAI API error ===", error);
      // Don't throw the error, just return null to allow fallback
      return null;
    }
  }, []);

  return { sendToOpenAI };
};
