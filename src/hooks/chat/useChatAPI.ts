
import { useCallback } from "react";
import { SYSTEM_PROMPT, createOpenAICompletion } from "@/utils/openai";

interface Message {
  text: string;
  isUser: boolean;
}

export const useChatAPI = () => {
  const sendToOpenAI = useCallback(async (currentInput: string, messages: Message[]): Promise<string | null> => {
    try {
      console.log("Attempting to get a response from OpenAI API...");
      
      const chatHistory = messages.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text
      }));
      
      chatHistory.unshift({
        role: "system",
        content: SYSTEM_PROMPT
      });
      
      chatHistory.push({
        role: "user",
        content: currentInput
      });
      
      const responseText = await createOpenAICompletion(chatHistory);
      
      if (responseText && responseText.trim() && !responseText.toLowerCase().includes("api") && !responseText.toLowerCase().includes("issue")) {
        console.log("OpenAI API response received successfully");
        return responseText;
      }
      
      console.log("OpenAI API response was empty or contained error indicators");
      return null;
    } catch (error) {
      console.log("OpenAI API unavailable, using built-in responses:", error);
      return null;
    }
  }, []);

  return { sendToOpenAI };
};
