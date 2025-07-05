
import { useCallback } from "react";
import { SYSTEM_PROMPT, createOpenAICompletion } from "@/utils/openai";

interface Message {
  text: string;
  isUser: boolean;
}

export const useChatAPI = () => {
  const sendToOpenAI = useCallback(async (currentInput: string, messages: Message[]): Promise<string | null> => {
    try {
      console.log("=== SEND TO OPENAI START ===");
      console.log("Current input:", currentInput);
      console.log("Message history length:", messages.length);
      
      const chatHistory = messages.map(msg => ({
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
      
      console.log("Full message history for OpenAI:", fullHistory);
      
      const responseText = await createOpenAICompletion(fullHistory);
      
      console.log("=== OPENAI RESPONSE RECEIVED ===");
      console.log("Raw response:", responseText);
      console.log("Response type:", typeof responseText);
      console.log("Response length:", responseText?.length);
      
      if (responseText && responseText.trim() && responseText.trim().length > 0) {
        console.log("=== RETURNING VALID OPENAI RESPONSE ===");
        return responseText.trim();
      }
      
      console.log("OpenAI response was empty or invalid, returning null");
      return null;
    } catch (error) {
      console.error("=== OPENAI API ERROR IN HOOK ===");
      console.error("Error details:", error);
      return null;
    }
  }, []);

  return { sendToOpenAI };
};
