
import { useCallback } from "react";
import { SYSTEM_PROMPT, createOpenAICompletion } from "@/utils/openai";

interface Message {
  text: string;
  isUser: boolean;
}

export const useChatAPI = () => {
  const sendToOpenAI = useCallback(async (currentInput: string, messages: Message[]): Promise<string | null> => {
    try {
      console.log("=== OPENAI API CALL START ===");
      console.log("Input:", currentInput);
      console.log("Message history length:", messages.length);
      
      const chatHistory = messages.map(msg => ({
        role: msg.isUser ? "user" as const : "assistant" as const,
        content: msg.text
      }));
      
      // Add system prompt
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
      
      console.log("Sending to OpenAI with message count:", fullHistory.length);
      
      const responseText = await createOpenAICompletion(fullHistory);
      
      console.log("OpenAI raw response:", responseText);
      console.log("Response type:", typeof responseText);
      console.log("Response length:", responseText?.length);
      
      if (responseText && responseText.trim() && responseText.trim().length > 0) {
        console.log("=== OPENAI API SUCCESS ===");
        return responseText.trim();
      }
      
      console.log("OpenAI API response was empty or invalid");
      return null;
    } catch (error) {
      console.error("=== OPENAI API ERROR ===");
      console.error("Error type:", error?.constructor?.name);
      console.error("Error message:", error?.message);
      console.error("Full error:", error);
      return null;
    }
  }, []);

  return { sendToOpenAI };
};
